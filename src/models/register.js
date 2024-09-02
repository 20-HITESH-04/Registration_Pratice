const mongoose = require('mongoose') ;
const bcrypt = require('bcryptjs') ;
const jwt = require('jsonwebtoken') ;

const registerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 50,
    } ,
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Enter a valid Email'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    } ,
    tokens : [{
        token : {
            type : String ,
            required : true
        }
    }]
})

registerSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id : this._id} , process.env.SECRET_KEY) ;
        this.tokens  = this.tokens.concat({token}) ;
        await this.save() ;
    } catch (error) {
        console.log(error) ;
        res.send(error) ;
    }
}

registerSchema.pre("save" , async function(next){
    if(this.isModified("password"))
    {
        this.password = await bcrypt.hash(this.password,10) ;
    }
    next() ;
})

const Register = new mongoose.model("Register" , registerSchema) ;

module.exports = Register ;