//import modules
import mongoose from "mongoose"
import validator from "validator";

const OtpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, 'Please Enter Your Email'],
        lowercase:true,
        validate:[validator.isEmail, 'Please Provide Correct Email']
    },
    otp:{
        type:String
    },
    createdTime:{
        type:Date,
        default:Date.now()
    }
},
{
    timestamps:true
})

export default mongoose.model('OTP', OtpSchema);

