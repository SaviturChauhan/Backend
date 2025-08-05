// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";

const app = express();
dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed!!", error);
  });

/*
import express from "express";
const app = express()
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
       console.error("Error: ", error);
       throw error
    })

    app.listen (process.env.PORT, () => {
      console.log(`App is listening on port: ${process.env.PORT}`)
    })
  } catch (error) {
    console.error("Error: ", error);
    throw err;
  }
})();

*/
