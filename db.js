// setup sqlite
const sqlite = require("sqlite3")

const db = new sqlite.Database("database.db")



// create the database tables if they dont exist
db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY,
        username TEXT,
        hashedPassword TEXT,
        name TEXT,
        motto TEXT,
        CONSTRAINT uniqueUsername UNIQUE(username)
    )
    `)

db.run(`
    CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY,
        make TEXT,
        model TEXT
    )
`)


// save accounts/cars in database
module.exports.registerUser = (username, hashedPassword, name, motto, callback) => {
    const query = `
    INSERT INTO accounts
        (username, hashedPassword, name, motto)
    VALUES
        (?, ?, ?, ?)
        `

    const values = [
        username,
        hashedPassword,
        name,
        motto
    ]
    db.run(query, values, callback)
}

 module.exports.registerCars = (make, model, callback) => {
    const query = `
    INSERT INTO cars
        (make, model)
    VALUES
        (?, ?)
    `

    const values = [
        make,
        model
    ]
    db.run(query, values, callback)
}  





//get all users from db
exports.getAllUsers = function (callback){
    const query = `
    SELECT * FROM accounts;
    `
    db.all(query, callback)
}


//get user from database
exports.getUserById = function (id, callback) {
    const query = `
    SELECT * FROM accounts WHERE id = ?`
    const values = [id]

    db.get(query, values, callback)
}

//get account from database LOGIN
exports.getAccountByUsername = function (username, callback) {
    const query = `
    SELECT * FROM accounts WHERE username = ?`
    const values = [username]

    db.get(query, values, callback)
}



//hämta flera cars
 exports.getAllCars = function (callback) {
    const query = `
    SELECT * FROM cars`;

    db.all(query, callback)
}  

//get car from database
exports.getCarById = function (id, callback) {
    const query = `
    SELECT * FROM cars WHERE id = ?`
    const values = [id]

    db.get(query, values, callback)
}