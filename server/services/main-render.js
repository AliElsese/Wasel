const connectDB = require('../database/connection')
const axios = require('axios')

module.exports = {
    showHomePage : (req,res) => {
        connectDB.query('SELECT * FROM procategorie' , (err,categories) => {
            if(err) res.send(err)
            connectDB.query('SELECT * FROM products' , (err,products) => {
                if(err) res.send(err)
                res.render('index' , {
                    categories : categories,
                    products : products
                })
            })
        })
    },

    showContactPage : (req,res) => {
        res.render('contact')
    },

    showAboutPage : (req,res) => {
        res.render('about')
    },

    showAllProductsPage : (req,res) => {
        connectDB.query('SELECT * FROM procategorie' , (err,categories) => {
            if(err) res.send(err)
            connectDB.query('SELECT * FROM products' , (err,products) => {
                if(err) res.send(err)
                res.render('products' , {
                    categories : categories,
                    products : products
                })
            })
        })
    },

    showSingleProduct : (req,res) => {
        var id = req.params.proid
        connectDB.query('SELECT * FROM products WHERE proid = ?' , [id] , (err,product) => {
            if(err) res.send(err)
            res.render('single-product' , {
                product : product
            })
        })
    },

    showCategorieProductsPage : (req,res) => {
        var cataname = req.params.cataname
        connectDB.query('SELECT * FROM procategorie' , (err,categories) => {
            if(err) res.send(err)
            connectDB.query('SELECT * FROM products WHERE cataname = ?' , [cataname] , (err,products) => {
                if(err) res.send(err)
                res.render('cata-products' , {
                    categories : categories,
                    products : products
                })
            })
        })
    },

    showServCategoriesPage : (req,res) => {
        axios.get('https://tskwasel.com/api-cataServices')
            .then(response => {
                res.render('cata-services' , {
                    categories : response.data
                })
            })
            .catch(err => {
                res.send(err)
            })
    },

    showCategorieServicesPage : (req,res) => {
        var scataname = req.params.scataname
        connectDB.query('SELECT * FROM services WHERE scataname = ?' , [scataname] , (err,services) => {
            if(err) res.send(err)
            res.render('services' , {
                services : services
            })
        })
    },

    showServiceForm : (req,res) => {
        var id = req.params.serviceid
        connectDB.query('SELECT * FROM services WHERE serviceid = ?' , [id] , (err,service) => {
            if(err) res.send(err)
            res.render('single-service' , {
                service : service
            })
        })
    }
}