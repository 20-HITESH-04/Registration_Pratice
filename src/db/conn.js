const mongoose = require('mongoose') ;

mongoose.connect("mongodb://localhost:27017/Practice_Reg").then(() => {
    console.log("Database connection done ........") ;
}).catch((e) => {
    console.log(e) ;
    console.log("Databse connection failed") ;
}) ;