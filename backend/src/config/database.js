import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Ã¢Å“â€¦ MongoDB Connected: ${conn.connection.host}`);
        console.log(`Ã°Å¸â€œÂ¦ Database: ${conn.connection.name}`);
    } catch (error) {
        console.error(`Ã¢ÂÅ’ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};
export default connectDB;
