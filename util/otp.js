//import modules
import OTP from 'otp-generator'

const generateOtp = () => {
    return (
        OTP.generate(
            6,
            {
                upperCaseAlphabets:true,
                lowerCaseAlphabets:false,
                specialChars:false
            }
        )
    )
}

export default generateOtp