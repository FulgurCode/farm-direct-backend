import express from "express"
import * as order from "../database/order.js"
import * as product from "../database/product.js"

export const router = express.Router()

const checkLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next()
    } else {
        next()
        // res.status(401).json("Not Logged In")
    }
}

router.post("/place", checkLogin, (req,res) => {
    let body = req.body
    let productId = req.query.id
    console.log(productId)
    product.getProductById(productId).then(pro => {
        console.log(pro)
        let price  = pro.price * body.quantity
        order.placeOrder(price, body.address, body.method).then((id) => {
            order.generateRazorpay(id,price).then((ro) => {
                res.json(ro)
            })
        })
    })
})

router.post("/verify", checkLogin, (req,res) => {
    let body = req.body
    let id = req.query.id
    order.verifyPayment(body).then(() => {
        order.changePaymentStatus(id,"placed").then(() => {
            res.status(200).json("Payment Success")
        })
    }).catch(e => {
        console.log(e)
        res.status(501).json("Payment failed")
    })
})