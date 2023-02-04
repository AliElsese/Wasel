const connectDB = require('../database/connection')
const axios = require('axios')

exports.find = (req,res) => {
    connectDB.query('SELECT * FROM products' , (err,products) => {
        if(err) res.send(err)
        else if(!products || products.length === 0) res.send('لا يوجد منتجات')
        res.send(products)
    })
}

exports.cataProducts = (req,res) => {
    var cataname = req.params.cataname
    connectDB.query('SELECT * FROM products WHERE cataname = ?' , [cataname] , (err,products) => {
        if(err) res.send(err)
        else if(!products || products.length === 0) res.send([])
        res.send(products)
    })
}

exports.create = (req,res) => {
    var qty = 1
    try {
        if( !req.body.proname || !req.body.prodescription || !req.body.proprice || !req.body.cataname || !req.file ){
            axios.get('https://tskwasel.com/api-proCategories')
                .then(response => {
                    res.render('add-product' , {
                        categories : response.data,
                        message : 'من فضلك املأ جميع البيانات'
                    })
                })
                .catch(err => {
                    res.send(err)
                })
            // res.send({message : 'من فضلك املأ جميع البيانات'})
        } else {
            var proimage = req.file.path
            var sql = 'INSERT INTO products SET ?'
            var product = {
                proname : req.body.proname,
                prodescription : req.body.prodescription,
                proimage : proimage,
                proprice : req.body.proprice,
                cataname : req.body.cataname,
                qty : qty
            }
            connectDB.query(sql , [product] , (err,results) => {
                if(err) res.send(err)
                else {
                    axios.get('https://tskwasel.com/api-proCategories')
                        .then(response => {
                            res.render('add-product' , {
                                categories : response.data,
                                message : 'تم التسجيل'
                            })
                        })
                        .catch(err => {
                            res.send(err)
                        })
                    // res.send({message : 'تم التسجيل'})
                }
            })
        }
    }
    catch (err) {
        res.send(err)
    }
}

exports.update = (req,res) => {
    var id = req.body.proid
    try {
        if( !req.body.proname || !req.body.proprice || !req.body.cataname || !req.body.prodescription || !req.file ){
            axios.get('https://tskwasel.com/api-products')
                .then(response => {
                    res.render('dashboard-products' , {
                        products : response.data,
                        message : 'من فضلك املأ جميع البيانات'
                    })
                })
                .catch(err => {
                    res.send(err)
                })
        } else {
            var proimage = req.file.path,
                proname = req.body.proname,
                prodescription = req.body.prodescription,
                proprice = req.body.proprice,
                cataname = req.body.cataname
            var sql = 'UPDATE products SET proname = ? , proprice = ? , cataname = ? , prodescription = ? , proimage = ?  WHERE proid = ?'
            connectDB.query(sql , [proname,proprice,cataname,prodescription,proimage,id] , (err,results) => {
                axios.get('https://tskwasel.com/api-products')
                    .then(response => {
                        res.render('dashboard-products' , {
                            products : response.data,
                            message : 'تم التعديل'
                        })
                    })
                    .catch(err => {
                        res.send(err)
                    })
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}

exports.delete = (req,res) => {
    var id = req.params.proid
    connectDB.query('DELETE FROM products WHERE proid = ?' , [id] , (err,results) => {
        if(err) res.send(err)
        axios.get('https://tskwasel.com/api-products')
            .then(response => {
                res.render('dashboard-products' , {
                    products : response.data,
                    message : 'تم الحذف'
                })
            })
            .catch(err => {
                res.send(err)
            })
        // res.send({message : 'تم الحذف'})
    })
}