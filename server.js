import express from "express";

const app = express();
const PORT = 3000;
import cookieParser from "cookie-parser"


app.listen(3000, () => {
	console.log("app is running and is listening to port 3000");
});
