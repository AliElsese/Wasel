const connectDB = require('../database/connection')
const axios = require('axios')

exports.find = (req,res) => {
    connectDB.query('SELECT * FROM procategorie' , (err,categories) => {
        if(err) res.send(err)
        else if(!categories || categories.length === 0) res.send([])
        res.send(categories)
    })
}

exports.create = (req,res) => {
    try {
        if( !req.body.cataname || !req.file ){
            res.render('add-proCategorie' , {
                message : 'من فضلك املأ جميع البيانات'
            })
            // res.send({message : 'من فضلك املأ جميع البيانات'})
        } else {
            var cataimage = req.file.path
            var sql = 'INSERT INTO procategorie SET ?'
            var categorie = {
                cataname : req.body.cataname,
                cataimage : cataimage
            }
            connectDB.query(sql , [categorie] , (err,results) => {
                if(err) res.send(err)
                else {
                    res.render('add-proCategorie' , {
                        message : 'تم التسجيل'
                    })
                    // res.send({message : 'تم التسجيل'})
                }
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}

exports.update = (req,res) => {
    var id = req.body.cataid
    try {
        if( !req.body.cataname || !req.file ){
            axios.get('https://tskwasel.com/api-proCategories')
            .then(response => {
                res.render('dashboard-proCategories' , {
                    categories : response.data,
                    message : 'من فضلك املأ جميع البيانات'
                })
            })
            .catch(err => {
                res.send(err)
            })
        } else {
            var cataimage = req.file.path,
                cataname = req.body.cataname
            var sql = 'UPDATE procategorie SET cataname = ? , cataimage = ? WHERE cataid = ?'
            connectDB.query(sql , [cataname,cataimage,id] , (err,results) => {
                axios.get('https://tskwasel.com/api-proCategories')
                    .then(response => {
                        res.render('dashboard-proCategories' , {
                            categories : response.data,
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
    var id = req.params.cataid
    connectDB.query('DELETE FROM procategorie WHERE cataid = ?' , [id] , (err,results) => {
        if(err) res.send(err)
        axios.get('https://tskwasel.com/api-proCategories')
            .then(response => {
                res.render('dashboard-proCategories' , {
                    categories : response.data,
                    message : 'تم الحذف'
                })
            })
            .catch(err => {
                res.send(err)
            })
        // res.send({message : 'تم الحذف'})
    })
}