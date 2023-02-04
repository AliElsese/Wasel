const connectDB = require('../database/connection')
const axios = require('axios')

exports.find = (req,res) => {
    connectDB.query('SELECT * FROM servcategorie' , (err,servcategories) => {
        if(err) res.send(err)
        else if(!servcategories || servcategories.length === 0) res.send([])
        res.send(servcategories)
    })
}

exports.cataServices = (req,res) => {
    var name = req.params.scataname
    connectDB.query('SELECT * FROM services WHERE scataname = ?' , [name] , (err,services) => {
        if(err) res.send(err)
        else if(!services || services.length === 0) res.send([])
        res.send(services)
    })
}

exports.addServCategorie = (req,res) => {
    try {
        if( !req.body.scataname || !req.file ){
            res.render('add-servCategorie' , {
                message : 'من فضلك املأ جميع البيانات'
            })
            // res.send({message : 'من فضلك املأ جميع البيانات'})
        } else {
            var scataimage = req.file.path
            var sql = 'INSERT INTO servcategorie SET ?'
            var categorie = {
                scataname : req.body.scataname,
                scataimage : scataimage
            }
            connectDB.query(sql , [categorie] , (err,results) => {
                if(err) res.send(err)
                else {
                    res.render('add-servCategorie' , {
                        message : 'تم التسجيل'
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

exports.updateServCategorie = (req,res) => {
    var id = req.body.scataid
    try {
        if( !req.body.scataname || !req.file ){
            axios.get('https://tskwasel.com/api-cataServices')
            .then(response => {
                res.render('dashboard-servCategories' , {
                    categories : response.data,
                    message : 'من فضلك املأ جميع البيانات'
                })
            })
            .catch(err => {
                res.send(err)
            })
        } else {
            var scataimage = req.file.path,
                scataname = req.body.cataname
            var sql = 'UPDATE servcategorie SET scataname = ? , scataimage = ? WHERE scataid = ?'
            connectDB.query(sql , [scataname,scataimage,id] , (err,results) => {
                axios.get('https://tskwasel.com/api-cataServices')
                    .then(response => {
                        res.render('dashboard-servCategories' , {
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

exports.create = (req,res) => {
    try {
        if( !req.body.servicename || !req.body.servicedescription || !req.body.scataname || !req.file ){
            axios.get('https://tskwasel.com/api-cataServices')
                .then(response => {
                    res.render('add-service' , {
                        categories : response.data,
                        message : 'من فضلك املأ جميع البيانات'
                    })
                })
                .catch(err => {
                    res.send(err)
                })
            // res.send({message : 'من فضلك املأ جميع البيانات'})
        } else {
            var serviceimage = req.file.path
            var sql = 'INSERT INTO services SET ?'
            var service = {
                servicename : req.body.servicename,
                servicedescription : req.body.servicedescription,
                serviceimage : serviceimage,
                scataname : req.body.scataname
            }
            connectDB.query(sql , [service] , (err,results) => {
                if(err) res.send(err)
                else {
                    axios.get('https://tskwasel.com/api-cataServices')
                        .then(response => {
                            res.render('add-service' , {
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
    var id = req.body.serviceid
    try {
        if( !req.body.servicename || !req.body.servicedescription || !req.body.scataname || !req.file ){
            axios.get('https://tskwasel.com/api-services')
                .then(response => {
                    res.render('dashboard-services' , {
                        services : response.data,
                        message : 'من فضلك املأ جميع البيانات'
                    })
                })
                .catch(err => {
                    res.send(err)
                })
        } else {
            var serviceimage = req.file.path,
                servicename = req.body.servicename,
                servicedescription = req.body.servicedescription,
                scataname = req.body.scataname
            var sql = 'UPDATE services SET servicename = ? , serviceimage = ? , servicedescription = ? , scataname = ? WHERE serviceid = ?'
            connectDB.query(sql , [servicename,serviceimage,servicedescription,scataname,id] , (err,results) => {
                axios.get('https://tskwasel.com/api-services')
                    .then(response => {
                        res.render('dashboard-services' , {
                            services : response.data,
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

exports.deleteServCategorie = (req,res) => {
    var id = req.params.scataid
    connectDB.query('SELECT scataname FROM servcategorie WHERE scataid = ?' , [id] , (err,categorie) => {
        if(err) res.send(err)
        connectDB.query('DELETE FROM services WHERE scataname = ?' , [categorie[0].scataname] , (err,results) => {
            if(err) res.send(err)
            connectDB.query('DELETE FROM servcategorie WHERE scataid = ?' , [id] , (err,results) => {
                if(err) res.send(err)
                axios.get('https://tskwasel.com/api-cataServices')
                    .then(response => {
                        res.render('dashboard-servCategories' , {
                            categories : response.data,
                            message : 'تم الحذف'
                        })
                    })
                    .catch(err => {
                        res.send(err)
                    })
                // res.send({message : 'تم الحذف'})
            })
        })
    })
}

exports.delete = (req,res) => {
    var id = req.params.serviceid
    connectDB.query('DELETE FROM services WHERE serviceid = ?' , [id] , (err,results) => {
        if(err) res.send(err)
        axios.get('https://tskwasel.com/api-services')
            .then(response => {
                res.render('dashboard-services' , {
                    services : response.data,
                    message : 'تم الحذف'
                })
            })
            .catch(err => {
                res.send(err)
            })
        // res.send({message : 'تم الحذف'})
    })
}

exports.allServices = (req,res) => {
    connectDB.query('SELECT * FROM services' , (err,services) => {
        if(err) res.send(err)
        res.send(services)
    })
}

exports.order = (req,res) => {
    if(!req.file){
        var order = {
            serviceName : req.body.serviceName,
            userName : req.body.userName,
            userPhone : req.body.userPhone,
            userAddress : req.body.userAddress,
            Simage : 'null'
        }
        var sql = 'INSERT INTO servicerequest SET ?'
        connectDB.query(sql , [order] , (err,results) => {
            if(err) res.send(err)
            res.send('done')
        })
    }
    else {
        var order = {
            serviceName : req.body.serviceName,
            userName : req.body.userName,
            userPhone : req.body.userPhone,
            userAddress : req.body.userAddress,
            Simage : `server/uploads/${req.file.filename}`
        }
        var sql = 'INSERT INTO servicerequest SET ?'
        connectDB.query(sql , [order] , (err,results) => {
            if(err) res.send(err)
            res.send('done')
        })
    }
}

exports.order1 = (req,res) => {
    if(!req.file){
        var order = {
            serviceName : req.body.serviceName,
            userName : req.body.userName,
            userPhone : req.body.userPhone,
            userAddress : req.body.userAddress,
            Simage : 'null'
        }
        var sql = 'INSERT INTO servicerequest SET ?'
        connectDB.query(sql , [order] , (err,results) => {
            if(err) res.send(err)
            res.render('cata-services' , {
                message : 'تم ارسال طلبك'
            })
        })
    }
    else {
        var order = {
            serviceName : req.body.serviceName,
            userName : req.body.userName,
            userPhone : req.body.userPhone,
            userAddress : req.body.userAddress,
            Simage : `server/uploads/${req.file.filename}`
        }
        var sql = 'INSERT INTO servicerequest SET ?'
        connectDB.query(sql , [order] , (err,results) => {
            if(err) res.send(err)
            res.render('cata-services' , {
                message : 'تم ارسال طلبك'
            })
        })
    }
}