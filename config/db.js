import mongoose from "mongoose";

const connectDB = async () => {
        try {
            const con = await mongoose.connect(process.env.MONGO_URI);
            console.log(`MONGODB connected: ${con.connection.host}`)
        } catch (error) {
            console.log(`Error connecting MONGODB: ${error}`)
        }
}

export default connectDB