import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const CONNECTION_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PW}@clustercm.yhm3dbm.mongodb.net/ecommerce_casemania?retryWrites=true&w=majority`;

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected"))
  .catch((error) => console.log(error));

mongoose.connection.on("error", (error) => {
  console.log(error);
});

