import mongoose from "mongoose";

const dbconnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_CONNECTION),
        console.log("DB Connected Successfully");
    } catch (error) {
        console.error(error);
    }
}
export default dbconnect;