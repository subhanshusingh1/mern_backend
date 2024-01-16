// import modules
import mongoose from "mongoose";
import validate from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// user schema
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, 'Please Enter Your Name'],
        trim:true
    },
    email:{
        type:String,
        required:[true, 'Please Enter Your Email!!!'],
        lowercase:true,
        validator:[validate.isEmail, 'Please Provide Valid Email'],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'Please Enter Your Password!!!'],
        minLength:6
    },
    mobile: {
        type:String,
        required:[true, 'Please Provide Your Mobile Number'],
        unique:[true, 'This Number is Already Registered'],
        validate:[validate.isMobilePhone, 'Please Provide Valid Mobile Number']
    }
},{
    timestamps:true
})


// Hashing Password using Bcrypt
userSchema.pre('save', async function(next) {
    try {
        if(!this.isModified('password')) {
            next()
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw new Error({message:`Password can't Be Hashed!!!!`})
    }
})

// Comparing Password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(this.password, password)
}

// Creating Json Web Token and storing it in cookie
userSchema.methods.createJwt = async function(res) {
    try {

        // crrating token using jwt
        const token = jwt.sign(
            {_id:this._id},
            process.env.JWT_SECRET,
            {
                expiresIn:'24h'
            }
        )

        // storing in cookie
        res.cookie(
            'jwt',
            token,
            {
                httpOnly:true,
                sameSite:'strict',
                secure:process.env.NODE_ENV !== 'development',
                maxAge: 24 * 60 * 60 * 1000
            }
        )

        return token
        
    } catch (error) {
        res.status(400).json({
            success:false,
            message:`Token Can't Be Created`
        })
    }
}

// user model
export default mongoose.model('User', userSchema);