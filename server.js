// import modules
import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';

const app = express()

// import files
import userRoutes from './routes/userRoutes.js'
import connectDB from './config/db.js';

// parse JSON bodies
app.use(express.json());
// parse URL_ENCODED Bodies
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).send("Welcome to Backend Development With MERN Stack");
})

// routes
app.use('/api/v1/users', userRoutes);


const start = async () => {
        try {
            await connectDB();
            app.listen(process.env.PORT, () => {
                console.log(`server is listening on Port: ${process.env.PORT}`);
            })
        } catch (error) {
            console.log(`Error connecting server: ${error}`);
        }
}

start();



