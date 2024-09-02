require('dotenv').config() ;
const express = require('express') ;
const mongoose = require('mongoose') ;
const hbs = require('hbs') ;
const path = require('path') ;
const Register = require('./models/register') ;
const bcrypt = require('bcryptjs');
require('./db/conn') ;

const static_path = path.join(__dirname,'../public') ;
const templates_path = path.join(__dirname,'/views') ;
const partial_path = path.join(__dirname , '/partials') ;

const port = process.env.PORT || 3000 ;
const app = express() ;
app.use(express.static(static_path)) ;
app.set("view engine" , "hbs") ;
app.set("views" , templates_path) ;
hbs.registerPartials(partial_path) ;
app.use(express.json()) ;
app.use(express.urlencoded({extended : false})) ;

app.listen(port,() => {
    console.log(`Registration is running on port ${port} .........`) ;
}) ;

app.get("/" , (req,res) => {
    res.render("index") ;
}) ;

app.get("/register" , (req,res) => {
    res.render("register") ;
}) ;

app.post("/register" , async (req,res) => {
    try {
        const password = await req.body.password ;
        const cpassword = await req.body.confirmPassword ;

        if(password === cpassword)
        {
            const postRegister = new Register({
                firstname : req.body.firstname ,
                username : req.body.username ,
                password : req.body.password ,
                email : req.body.email 
            }) ;

            const token = await postRegister.generateAuthToken() ;

            const registered = await postRegister.save() ;
            res.status(201).render('index') ;
        }
        else
        {
            res.send("password an confirm password are not matching ....... ") ;
        }
    } catch (error) {
        console.log(error) ;
        res.status(400).send(error) ;
    }
}) ;

app.post("/login" , async (req,res) => {
    try {
        const email = await req.body.email ;
        const password = await req.body.password ;

        const useremail = await Register.findOne({email : email}) ;

        const isMatch = await bcrypt.compare(password,useremail.password) ;

        if(isMatch)
        {
            res.status(201).render('index') ;
        }
        else
        {
            res.send("Password is not matching ..........") ;
        }
    } catch (error) {
        console.log(error) ;
        res.status(400).send(error) ;
    }
}) ;

app.get("/login" , (req,res) => {
    res.render("login") ;
}) ;