import mongoose from "mongoose";

async function connectDb() {
  await mongoose.connect(process.env.MONGO_URL);
}

export default connectDb;
