// SETUP
const express = require('express')


const db = require('./db.js')
const utils = require('./utils')

const app = express()

app.use(express.json())


// GET USER FROM TOKEN IF LOGGED IN
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


// FORCE LOGIN MIDDLEWARE
const forceAuthorize = (req, res, next) => {
    if (req.user.isLoggedIn){
        next()
    }
    else{
        res.sendStatus(401)
    }
}


// GET STARTPAGE
app.get("/", (req, res) => {
    res.send(req.user)
})


// GET ALL USERS
app.get("/users", forceAuthorize, (req, res) => {
    db.getAllUsers((error, users) => {
        if(error){
            console.log(error)
            res.status(500).send(error)
        } else{
            res.send(users)
        }
    })
    
})

//GET ONE USER
    app.get("/user/:id", forceAuthorize, (req, res) => {
        const id = parseInt(req.params.id)
        db.getUserById(id, (error, user) => {
            if(error){
                console.log(error)
                res.status(500).send(error)
            } else{
                res.send(user)
            }
        })
        
})




// REGISTER NEW USER
app.post("/register", (req,res) => {
    const {username, password, name, motto} = req.body

    const hashedPassword = utils.hashPassword(password)

    db.registerUser(username, hashedPassword, name, motto, (error) => {
        if(error){
            console.log(error);
            res.status(500).send(error)
        }
        else{
            res.sendStatus(200)
        }
    })
})

// POST CARS
app.post("/cars", forceAuthorize, (req, res) => {
    const {make, model} = req.body

    db.registerCars(make, model, (error) => {
        if(error){
            console.log(error);
            res.status(500).send(error)
        } else{
            res.sendStatus(200)
        }
    })
})



// LOG IN USER
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


// FORCE LOGIN TO GET SECRETS
app.get("/secrets", forceAuthorize, (req, res) => {
    res.send({
        secret1: "There was a house in New Orleans",
        secret2: "They called The rising sun",
    })
})

// GET ALL CARS
app.get("/cars", forceAuthorize, (req, res) => {
    db.getAllCars((error, cars) => {
        if(error){
            console.log(error)
            res.status(500).send(error)
        } else{
            res.send(cars)
        }
    })
    
})



// GET ONE CAR
    app.get("/car/:id", forceAuthorize, (req, res) => {
        const id = parseInt(req.params.id)
        db.getCarById(id, (error, car) => {
            if(error){
                console.log(error)
                res.status(500).send(error)
            } else{
                res.send(car)
            }
        })
        
})


app.listen(6500, () => {
    console.log("http://localhost:6500/ LYSSNAR PÅ DENNA" )
})