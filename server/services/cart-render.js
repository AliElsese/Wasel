const {LocalStorage} = require('node-localstorage')
localStorage = new LocalStorage('./scratch')

module.exports = {
    getCartPage : (req,res) => {
        if(localStorage.getItem('products') != null){
            if  (localStorage.getItem('products') != "")
            {
                var productsInCart = JSON.parse(localStorage.getItem('products'))
                if(productsInCart.length === 0){
                    res.render('notfound')
                } else {
                    res.render('cart' , {
                        productsInCart : productsInCart
                })
                }
            }else {
                res.render('notfound')
            }
        } else {
            res.render('notfound')
        }
        
    }
}