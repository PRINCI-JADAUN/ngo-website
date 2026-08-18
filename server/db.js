import mongoose from "mongoose";

export async function connectDatabase(uri) {
  const connectionUri = uri || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ngo-site";
  mongoose.set("strictQuery", true);

  return mongoose.connect(connectionUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
