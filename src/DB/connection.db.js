import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.URI;
    const result = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`connect DB successfully`);
    
  } catch (error) {
    console.log(`fail to connect to DB`);
    
  }
};


export default connectDB