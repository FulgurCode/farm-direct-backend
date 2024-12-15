import express from "express"
import * as product from "../database/product.js"
import { Timestamp } from "mongodb"

export const router = express.Router()

const checkLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next()
    } else {
        res.status(401).json("Not Logged In")
    }
}

router.post("/add", checkLogin, async (req, res) => {
    let { title, description, price } = req.body
    let seller = req.session.userId
    product.addProduct({ title, description, price, seller }).then((id) => {
        let image = req.files.image
        let fileName = req.files.image.name
        const extension = fileName.substring(fileName.lastIndexOf('.'));
        image.mv('public/images/' + id + '.jpg');
        res.json("product added")
    })
})

router.get("/search", checkLogin, (req, res) => {
    let search = req.query.search
    product.searchProduct(search).then((products) => {
        res.json(products)
    })
})

router.get("/:category", (req, res) => {
    let category = req.params.category
    product.productByCategory(category).then((products) => {
        res.json(products)
    })
})

router.post("/bidding-product", (req, res) => {
    let { name, description, base_price, bid_time } = req.body
    let seller = req.session.userId
    product.AddBidProduct({ name, description, base_price, bid_time, seller }).then((id) => {
        let image = req.files.image
        let fileName = req.files.image.name
        const extension = fileName.substring(fileName.lastIndexOf('.'));
        image.mv('public/images/' + id + '.jpg');
    })
    res.json("Add new product for bidding")
})

router.get("/bidding-products", (req, res) => {
    product.GetBidProducts().then((products) => {
        res.json(products)
    })
})

router.post("/bid-product", (req, res) => {
    let userId = req.session.userId
    let id = req.query.id
    let price = req.body.price

    product.BidProduct(id, userId, price).then(() => {
        res.json("Bidded Successfully")
    })
})