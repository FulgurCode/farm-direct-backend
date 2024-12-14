import { db } from "../mongo/connect.js"
import Razorpay from "razorpay"
import { createHmac } from "crypto"
import { ObjectId } from "mongodb"

const KEY_ID = 'rzp_test_nyXfWw6c82FKiv'
const KEY_SECRET = 'fRmYl0sLISE1n4kzuPWZCHpp'

const instance = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
});

export const placeOrder = (price, address, method) => {
    return new Promise((resolve, reject) => {
        const data = {
            address,
            price,
            status: method == "COD" ? "placed" : "pending",
        }
        db.collection("order").insertOne(data).then(({ insertedId }) => {
            resolve(insertedId)
        })
    })
}

export const generateRazorpay = (orderId, price) => {
    return new Promise((resolve, reject) => {
        let options = {
            amount: price * 100,
            currency: "INR",
            receipt: "" + orderId,
        }
        console.log(options)
        instance.orders.create(options).then((order) => {
            console.log(order)
            resolve(order)
        })
    })
}

export const verifyPayment = (payment) => {
    return new Promise((resolve, reject) => {
        var hmac = createHmac("sha256", KEY_SECRET)
        hmac.update(payment.razorpay_order_id + '|' + payment.razorpay_payment_id)
        hmac = hmac.digest("hex")
        if (hmac == payment.razorpay_signature) {
            resolve()
        } else {
            reject()
        }
    })
}

export const changePaymentStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        db.collection("order").updateOne({ "_id": ObjectId.createFromHexString(id) }, { "$set": { status: "placed" } })
    })
}