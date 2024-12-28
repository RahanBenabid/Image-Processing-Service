import express from "express";

const app = express();
const PORT = 3000;
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
// connectDB();

app.listen(PORT, () => {
	console.log(`app is running and is listening to port ${PORT}`);
});
