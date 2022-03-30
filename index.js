//1. SETUP
const express = require('express')


const db = require('./db.js')
const utils = require('./utils')

const app = express()

app.use(express.json())


//2. get user from token if logged in
app.use((req, res, next) => {
    const token = req.headers.authorization

    if (token && utils.verifyJWT(token)){
        const tokenData = utils.decodeJWT(token)
        req.user = tokenData
        req.user.isLoggedIn = true
    }
    else{
        req.user = {isLoggedIn: false}
    }

    next()
})


// 3. force login middleware
const forceAuthorize = (req, res, next) => {
    if (req, res, next){
        next()
    }
    else{
        res.sendStatus(401)
    }
}


// 4. get start page
app.get("/", (req, res) => {
    res.send(req.user)
})


// 5. register new user
app.post("/register", (req,res) => {
    const {username, password} = req.body

    const hashedPassword = utils.hashPassword(password)

    db.registerUser(username, hashedPassword, (error) => {
        if(error){
            console.log(error);
            res.status(500).send(error)
        }
        else{
            res.sendStatus(200)
        }
    })
})


// 6. log in user
app.post("/login", (req, res) => {
    const {username, password} = req.body

    db.getAccountByUsername(username, (error, account) => {
        if(error){
            res.status(500).send(error);
        }
        else if(account){
            const hashedPassword = account.hashedPassword
            const correctPassword = utils.comparePassword(password, hashedPassword)
            
            if(correctPassword){
                const jwtToken = utils.getJWTToken(account)
                res.send(jwtToken)
            }
            else{
                res.sendStatus(404)
            }
        }
        else{
            res.sendStatus(404)
        }
    })
})


// 7. force login to get secrets
app.get("/secrets", forceAuthorize, (req, res) => {
    res.send({
        secret1: "There was a house in New Orleans",
        secret2: "They called The rising sun",
    })
})

 
 // 5. register new cars
app.post("/cars", (req,res) => {
    const {make, model} = req.body

    db.registerCars(make, model, (error) => {
        if(error){
            console.log(error);
            res.status(500).send(error)
        }
        else{
            res.sendStatus(200)
        }
    })
})














app.listen(8000, () => {
    console.log("http://localhost:8000/ LYSSNAR PÅ DENNA" )
})