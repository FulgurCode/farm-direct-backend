import express from "express"
import * as auth from "../database/auth.js"
import bcrypt from "bcrypt"

export const router = express.Router()

router.post("/signup", (req,res) => {
    let body = req.body
    auth.getUser(body.email).then((result) => {
        if (result != null ) {
            res.status(401).json("Already registerd with this email")
            return
        }
        body.password = bcrypt.hash(body.password, 9).then((pass) => {
            auth.addUser(body.email, pass)
            res.status(200).json("Signup Successfull")
        })
    })
})

router.post("/login", (req,res) => {
    let body = req.body
    auth.getUser(body.email).then((data) => {
        if (data == null || !bcrypt.compare(body.password,data.password)) {
            res.status(401).json("Invalid credentials")
            return
        }

        req.session.isLoggedIn = true
        req.session.email = data.email
        req.session.userId = data._id

        res.json("Loggin success")
    })
})

router.delete("/logout", (req,res) => {
    req.session.isLoggedIn = false
    req.session.email = null
    req.session.userId = null

    res.json("Logged Out Successfully")
})

router.get("/checklogin", (req,res) => {
    if (req.session.isLoggedIn) {
        res.status(200).json("Logged In")
    } else {
        res.status(401).json("Not Logged In")
    }
})