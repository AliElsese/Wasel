const express = require('express');
const route = express.Router();
const connectDB = require('../database/connection')
const jwt = require('jsonwebtoken')
const {verify} = require('./middleware')

const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , './server/uploads')
    },

    filename : (req , file , cb) => {
        cb(null , file.originalname)
    }
})
const upload = multer({ storage : storage })

const dashboardRender = require('../services/dashboard-render')
const mainRender = require('../services/main-render')
const cartRender = require('../services/cart-render')

const categorieController = require('../controllers/categorie-controller')
const productController = require('../controllers/product-controller')
const serviceController = require('../controllers/service-controller')
const orderController = require('../controllers/order-controller')

// api categorie
route.get('/api-proCategories' , categorieController.find)
route.post('/api-addProCategorie' , upload.single('cataimage') , categorieController.create)
route.post('/api-updateProCategorie' , upload.single('cataimage') , categorieController.update)
route.get('/api-deleteProCategorie/:cataid' , categorieController.delete)

// api product
route.get('/api-products' , productController.find)
route.get('/api-cataProducts/:cataname' , productController.cataProducts)
route.post('/api-addProduct' , upload.single('proimage') , productController.create)
route.post('/api-updateProduct' , upload.single('proimage') , productController.update)
route.get('/api-deleteProduct/:proid' , productController.delete)

// api service
route.get('/api-cataServices' , serviceController.find)
route.get('/api-services' , serviceController.allServices)
route.get('/api-cataServices/:scataname' , serviceController.cataServices)
route.post('/api-addServCategorie' , upload.single('scataimage') , serviceController.addServCategorie)
route.post('/api-addService' , upload.single('serviceimage') , serviceController.create)
route.post('/api-updateServCategorie' , upload.single('scataimage') , serviceController.updateServCategorie)
route.post('/api-updateService' , upload.single('serviceimage') , serviceController.update)
route.get('/api-deleteServCategorie/:scataid' , serviceController.deleteServCategorie)
route.get('/api-deleteService/:serviceid' , serviceController.delete)
route.post('/api-orderService' , upload.single('Simage') , serviceController.order)
route.post('/api-orderService1' , upload.single('Simage') , serviceController.order1)

// api order
route.post('/api-addOrder' , orderController.addOrder)
route.get('/api-proOrders' , orderController.proOrders)
route.get('/api-deleteProOrder/:orderid' , orderController.deleteProOrder)
route.get('/api-servOrders' , orderController.servOrders)
route.get('/api-deleteServOrder/:requestid' , orderController.deleteServOrder)

route.post('/add-to-cart' , orderController.addToStorage)

// dashboard render
route.get('/logout' , (req,res) => {
    res.clearCookie('jwt').render('login')
})

route.post('/login' , (req,res) => {
    try{
        var { name , password } = req.body

        if( !name || !password ) {
            return res.render('login' , {
                message : 'من فضلك قم بادخال اسمك وكلمة السر'
            })
        }

        else {
            connectDB.query('SELECT * FROM admin WHERE username = ?' , [ name ] , async (err , results) => {
                if(!results || results.length == 0 || password != results[0].password){
                    console.log(results[0])
                    return res.render('login' , {
                        message : 'اسم المستخدم او كلمة السر خطأ'
                    })
                } 
                else {
                    var id = results[0].adminid
                    var token = jwt.sign({id : id} , process.env.JWT_SECRET , {
                        expiresIn : process.env.JWT_EXPIRES_IN
                    })
                    var cookieOptions = {
                        expires : new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly : false,
                        secure : false
                    }
                    res.cookie('jwt' , token , cookieOptions)
                    res.render('dashboard')
                }
            })
        }
    }
    catch (err) {
        console.log(err)
    }
})

route.get('/admin' , (req,res) => {
    res.render('login')
})

route.get('/dashboard' , verify , dashboardRender.showDashboardPage)

route.get('/dashboard-proCategories' , verify , dashboardRender.showDashboardProCategories)
route.get('/add-proCategorie' , verify , dashboardRender.showAddProCategorie)
route.get('/update-proCategorie/:cataid' , verify , dashboardRender.showUpdateProCategorie)

route.get('/dashboard-products' , verify , dashboardRender.showDashboardProducts)
route.get('/add-product' , verify , dashboardRender.showAddProduct)
route.get('/update-product/:proid' , verify , dashboardRender.showUpdateProduct)

route.get('/dashboard-servCategories' , verify , dashboardRender.showDashboardServCategories)
route.get('/add-servCategorie' , verify , dashboardRender.showAddServCategorie)
route.get('/update-servCategorie/:scataid' , verify , dashboardRender.showUpdateServCategorie)

route.get('/dashboard-services' , verify , dashboardRender.showDashboardServices)
route.get('/add-service' , verify , dashboardRender.showAddService)
route.get('/update-service/:serviceid' , verify , dashboardRender.showUpdateService)

route.get('/dashboard-proOrders' , verify , dashboardRender.showProOrders)
route.get('/single-proOrder/:orderid' , verify , dashboardRender.showSingleProOrder)
route.get('/dashboard-servOrders' , verify , dashboardRender.showServOrders)

// main render
route.get('/' , mainRender.showHomePage)
route.get('/contact' , mainRender.showContactPage)
route.get('/about' , mainRender.showAboutPage)
route.get('/products' , mainRender.showAllProductsPage)
route.get('/single-product/:proid' , mainRender.showSingleProduct)
route.get('/products/:cataname' , mainRender.showCategorieProductsPage)
route.get('/servCategories' , mainRender.showServCategoriesPage)
route.get('/servCategorie/:scataname' , mainRender.showCategorieServicesPage)
route.get('/single-service/:serviceid' , mainRender.showServiceForm)

// cart render
route.get('/cart' , cartRender.getCartPage)
route.get('/notfound' , cartRender.getCartPage)

module.exports = route