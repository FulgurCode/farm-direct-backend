import express from "express"
import * as product from "../database/product.js"

export const router = express.Router()

const checkLogin = (req,res,next) => {
    if (req.session.isLoggedIn) {
        next()
    } else {
        res.status(401).json("Not Logged In")
    }
}

router.post("/add", checkLogin, async (req,res) => {
    let body = req.body
    product.addProduct(body)
    res.json("product added")
})

router.get("/search", checkLogin, (req,res) => {
    let search = req.query.search
    product.searchProduct(search).then((products) => {
        res.json(products)
    })
})

router.get("/:category", (req,res) => {
    let category = req.params.category
    product.productByCategory(category).then((products) => {
        res.json(products)
    })
})
