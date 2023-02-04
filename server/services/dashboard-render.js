const connectDB = require('../database/connection')
const axios = require('axios')

module.exports = {
    showDashboardPage : (req,res) => {
        res.render('dashboard')
    },

    showDashboardProCategories : (req,res) => {
        axios.get('https://tskwasel.com/api-proCategories')
            .then(response => {
                res.render('dashboard-proCategories' , {
                    categories : response.data
                })
            })
            .catch(err => {
                res.send(err)
            })
    },

    showAddProCategorie : (req,res) => {
        res.render('add-proCategorie')
    },

    showUpdateProCategorie : (req,res) => {
        var id = req.params.cataid
        connectDB.query('SELECT * FROM procategorie WHERE cataid = ?' , [id] , (err,categorie) => {
            if(err) res.send(err)
            res.render('update-proCategorie' , {
                categorie : categorie
            })
        })
    },

    showDashboardProducts : (req,res) => {
        axios.get('https://tskwasel.com/api-products')
            .then(response => {
                res.render('dashboard-products' , {
                    products : response.data
                })
            })
            .catch(err => {
                res.send(err)
            })
    },

    showAddProduct : (req,res) => {
        axios.get('https://tskwasel.com/api-proCategories')
            .then(response => {
                res.render('add-product' , {
                    categories : response.data
                })
            })
            .catch(err => {
                res.send(err)
            })
    },

    showUpdateProduct : (req,res) => {
        var id = req.params.proid
        connectDB.query('SELECT * FROM products WHERE proid = ?' , [id] , (err,product) => {
            if(err) res.send(err)
            connectDB.query('SELECT * FROM procategorie' , (err,categories) => {
                if(err) res.send(err)
                res.render('update-product' , {
                    product : product,
                    categories : categories
                })
            })
        })
    },

    showDashboardServCategories : (req,res) => {
        axios.get('https://tskwasel.com/api-cataServices')
            .then(response => {
                res.render('dashboard-servCategories' , {
                    categories : response.data
                })
            })
            .catch(err => {
                res.send(err)
            })
    },

    showAddServCategorie : (req,res) => {
        res.render('add-servCategorie')
    },

    showUpdateServCategorie : (req,res) => {
        var id = req.params.cataid
        connectDB.query('SELECT * FROM servcategorie WHERE scataid = ?' , [id] , (err,categorie) => {
            if(err) res.send(err)
            res.render('update-servCategorie' , {
                categorie : categorie
            })
        })
    },

    showDashboardServices : (req,res) => {
        axios.get('https://tskwasel.com/api-services')
            .then(response => {
                res.render('dashboard-services' , {
                    services : response.data
                })
            })
            .catch(err => {
                res.send(err)
            })
    },

    showAddService : (req,res) => {
        axios.get('https://tskwasel.com/api-cataServices')
            .then(response => {
                res.render('add-service' , {
                    categories : response.data
                })
            })
            .catch(err => {
                res.send(err)
            })
    },

    showUpdateService : (req,res) => {
        var id = req.params.serviceid
        connectDB.query('SELECT * FROM services WHERE serviceid = ?' , [id] , (err,service) => {
            if(err) res.send(err)
            connectDB.query('SELECT * FROM servcategorie' , (err,categories) => {
                if(err) res.send(err)
                res.render('update-service' , {
                    service : service,
                    categories : categories
                })
            })
        })
    },

    showProOrders : (req,res) => {
        axios.get('https://tskwasel.com/api-proOrders')
            .then(response => {
                res.render('dashboard-proOrders' , {
                    orders : response.data
                })
            })
            .catch(err => {
                res.send(err)
            })
    },

    showSingleProOrder : (req,res) => {
        var id = req.params.orderid
        connectDB.query('SELECT * FROM cart WHERE orderid = ?' , [id] , (err,products) => {
            if(err) res.send(err)
            res.render('single-proOrder' , {
                products : products
            })
        })
    },

    showServOrders : (req,res) => {
        axios.get('https://tskwasel.com/api-servOrders')
            .then(response => {
                res.render('dashboard-servOrders' , {
                    orders : response.data
                })
            })
            .catch(err => {
                res.send(err)
            })
    }, 
}