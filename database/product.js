import { ObjectId } from "mongodb"
import { db } from "../mongo/connect.js"

export const addProduct = (product) => {
    return new Promise((resolve, reject) => {
        db.collection("products").insertOne(product).then(result => {
            resolve(result.insertedId)
        })
    })
}

export const productByCategory = (category) => {
    return new Promise((resolve, reject) => {
        let result = db.collection("products").find({ "category": category }).toArray()
        resolve(result)
    })
}
export const searchProduct = (name) => {
    return new Promise((resolve, reject) => {
        let result = db.collection("products").find({ "$or": [{ "name": { "$regex": name } }, { "description": { "$regex": name } }, { "cetegory": { "$regex": name } }] }).toArray()
        resolve(result)
    })
}

export const getProductById = (id) => {
    return new Promise((resolve, reject) => {
        let product = db.collection("products").findOne({ "_id": ObjectId.createFromHexString(id) })
        resolve(product)
    })
}

export const AddBidProduct = (product) => {
    return new Promise((resolve, reject) => {
        let product = db.collection("products-bid").insertOne({ product }).then((res) => {
            resolve(res.insertedId)
        })
    })
}

export const GetBidProducts = (page = 1, limit = 20) => {
    return new Promise((resolve, reject) => {
        let products = db.collection("products-bid").find().skip((page - 1) * limit).limit(limit).toArray().then((products) => {
            resolve(products)
        })
    })
}

export const GetBidProduct = (id) => {
    return new Promise((resolve, reject) => {
        let product = db.collection("products-bid").findOne({ "_id": ObjectId.createFromHexString(id) })
    })
}

export const BidProduct = (id, userId, price) => {
    return new Promise((resolve, reject) => {
        db.collection("products-bid").updateOne({ "_id": ObjectId.createFromHexString(id) }, { "$set": { "current_user": userId, "price": price } }).then((res) => {
            console.log(res)
            resolve()
        })
    })
}

export const GetProducts = (page = 1, limit = 20) => {
    return new Promise((resolve, reject) => {
        db.collection("product-bid").find().skip((page - 1) * limit).limit(limit).toArray().then((res) => {

        })
    })
}