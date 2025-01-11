const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app =express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const connectToDB = require("./db/db")
connectToDB(); //initiating connection to the database
app.use(cookieParser());

const userRoutes = require('./routes/user.routes');
const captainRoutes = require("./routes/captain.routes") //constructing the captain route
const  rideRoutes = require('./routes/ride.routes');
const mapRoutes = require('./routes/maps.routes');


app.get('/', (req, res) => {
    res.send('Hello World');
}   );      

app.use('/users',userRoutes); //extend the URL forming to userRoutes!
app.use('/captains',captainRoutes)
app.use('/rides',rideRoutes);
app.use('/maps',mapRoutes);


module.exports = app;