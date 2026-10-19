import mongoose from "mongoose"


export const DBCONNECT = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo DB is connect ")
    } catch (error) {
        console.log("Mongo DB is not connect ")
    }
}