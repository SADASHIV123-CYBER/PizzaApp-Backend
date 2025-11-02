import mongoose from "mongoose";
import serverConfig from "./serverConfig.js";


async function connectDB() {
    try {
        await mongoose.connect(serverConfig.DB_URL);
        console.log("successfully connected to MongoDB");
    } catch (error) {
        console.log("not able to connect MongoDB");
        console.log(error);
    }
}

export default connectDB