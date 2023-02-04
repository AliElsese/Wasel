const connectDB = require('../database/connection')
const axios = require('axios')

exports.addOrder = (req,res) => {
    var user = {
        userName : req.body.userName,
        userPhone : req.body.userPhone,
        userAddress : req.body.userAddress
    }
    connectDB.query('INSERT INTO orders SET ?' , [user] , (err,order) => {
        if(err) res.send(err)
        var cart = req.body.cart
        var cart1 = []
        for(var i = 0; i < cart.length; i++){
            var data = {
                orderid : order.insertId,
                proname : cart[i].productName,
                proprice : cart[i].productPrice,
                proimage : cart[i].productImage,
                qty : cart[i].qty
            }
            cart1.push(data)
        }
        var sql = 'INSERT INTO cart SET orderid = ? , proname = ? , proprice = ? , proimage = ? ,  qty = ?'
        for(var x = 0; x < cart1.length; x++){
            connectDB.query(sql , [cart1[x].orderid,cart1[x].proname,cart1[x].proprice,cart1[x].proimage,cart1[x].qty] , (err,results) => {
                if(err) res.send(err)
            })
        }
        res.send('تم تسجيل الطلب')
    })
}

exports.proOrders = (req,res) => {
    connectDB.query('SELECT * FROM orders' , (err,orders) => {
        if(err) res.send(err)
        res.send(orders)
    })
}

exports.deleteProOrder = (req,res) => {
    var id = req.params.orderid
    connectDB.query('DELETE FROM orders WHERE orderid = ?' , [id] , (err,result) => {
        if(err) res.send(err)
        connectDB.query('DELETE FROM cart WHERE orderid = ?' , [id] , (err,results) => {
            if(err) res.send(err)
            axios.get('https://tskwasel.com/api-proOrders')
                .then(response => {
                    res.render('dashboard-proOrders' , {
                        orders : response.data
                    })
                })
                .catch(err => {
                    res.send(err)
                })
        })
    })
}

exports.servOrders = (req,res) => {
    connectDB.query('SELECT * FROM servicerequest' , (err,orders) => {
        if(err) res.send(err)
        res.send(orders)
    })
}

exports.deleteServOrder = (req,res) => {
    var id = req.params.requestid
    connectDB.query('DELETE FROM servicerequest WHERE requestid = ?' , [id] , (err,result) => {
        if(err) res.send(err)
        axios.get('https://tskwasel.com/api-servOrders')
            .then(response => {
                res.render('dashboard-servOrders' , {
                    orders : response.data
                })
            })
            .catch(err => {
                res.send(err)
            })
    })
}