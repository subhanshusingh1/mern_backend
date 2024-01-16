//import module
import nodemailer from 'nodemailer';
import mailgen from 'mailgen';

// create transport
const createTransport = () => {
    return nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
})
}

// Generating Email Content
const generateEmailContent = (email, otp) => {
    return {
        body : {
            name:email,
            intro : 
            "Welcome to Backend Authentication! We're very excited to have you on board.",
            outro: `Your OTP from ${email} verification is ${otp}`
        }
    }
}

// Create Email Body
const createEmailTheme = (emailContent) => {
    const mailGenerator = new mailgen({
        theme:'default',
        product: {
            name: `Backend Authentication`,
            link: "https://mailgen.js",
        }
    })
    return mailGenerator.generate(emailContent)
}

// Generate Email
const generateEmail = (email, otp) => {
    const emailContent = generateEmailContent(email, otp);
    return createEmailTheme(emailContent);
}

const transport = createTransport();

const sendMail = async (req, res, email, otp) => {

        // generating otp
    // const otp = await generateOtp();

    if(!otp) {
        return res.status(500).send({message:'Error Generating OTP'})
    }

      // generate HTML email
      const emailBody = generateEmail(email, otp);
      const message = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "SignUp Successful",
        html: emailBody,
      }
      // send mail
      await transport.sendMail(message);
}

export default sendMail