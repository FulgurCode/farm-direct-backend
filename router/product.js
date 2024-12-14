import express from "express"
import * as product from "../database/product.js"

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
    product.addProduct({ title, description, price }).then((id) => {
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