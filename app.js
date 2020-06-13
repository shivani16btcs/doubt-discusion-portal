const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./angular/backend/Routes/users');
const postRoutes = require('./angular/backend/Routes/posts');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
dotenv.config();
const checkAuth = require('./angular/backend/Middlewares/check-Auth');
const app = express();
app.use(cors()); 


mongoose.connect("mongodb://localhost:27017/PPLdb",{useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log('Database connected...'))
    .catch(() => console.log('DB not connected'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ useNewUrlParser: true,extended: false }));
mongoose.set('useCreateIndex', true);
app.use("/images",express.static(path.join("images")));

app.use("/auth", userRoutes);
app.use("/post", checkAuth,  postRoutes); 

//console.log( process.env.PORT );
app.listen( 3000 );