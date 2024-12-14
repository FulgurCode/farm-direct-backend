import { db } from "../mongo/connect.js"

export const addProduct = (product) => {
    return new Promise((resolve,reject) => {
        let result = db.collection("products").insertOne(product)
        resolve(result)
    })
}

export const productByCategory = (category) => {
    return new Promise((resolve, reject) => {
        let result = db.collection("products").find({"category":category}).toArray()
        resolve(result)
    })
}

export const searchProduct = (name) => {
    return new Promise((resolve,reject) => {
        let result = db.collection("products").find({"name": {"$regex": name }}).toArray()
        resolve(result)
    })
}