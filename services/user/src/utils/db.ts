import mongoose from "mongoose";

const connectDb = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "blog",
    });
    console.log("connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
