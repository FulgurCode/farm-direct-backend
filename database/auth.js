import { db } from "../mongo/connect.js"

export const getUser = (email) => {
    return new Promise(async (resolve, reject) => {
        let result = await db.collection("user").findOne({email:email})
        console.log("result")
        console.log(result)
        resolve(result)
    })
}

export const addUser = (email,password) => {
    return new Promise((resolve,reject) => {
        let result = db.collection("user").insertOne({email,password})
        resolve(result)
    })
}