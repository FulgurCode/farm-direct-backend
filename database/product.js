import { db } from "../mongo/connect.js"

export const addProduct = (product) => {
    return new Promise((resolve,reject) => {
        let result = db.collection("products").insertOne(product)
        resolve(result)
    })
}