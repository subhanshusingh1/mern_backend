//Importing otp generator module
import OTP from 'otp-generator'

// Function to generate 6 digit otp
const generateOtp = () => {
    return (
        OTP.generate(
            6, // Length of otp
            {
                upperCaseAlphabets:true, // Include Uppercase Letter
                lowerCaseAlphabets:false, // Exclude Lowercase Letter
                specialChars:false // Exclude special characters
            }
        )
    )
}

export default generateOtp
