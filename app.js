const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app =express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const connectToDB = require("./db/db")
connectToDB(); //initiating connection to the database

const userRoutes = require('./routes/user.routes');
app.get('/', (req, res) => {
    res.send('Hello World');
}   );      

app.use('/users',userRoutes); //extend the URL forming to userRoutes!
module.exports = app;