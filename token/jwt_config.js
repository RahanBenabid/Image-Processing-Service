import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.TOKEN_SECRET);

function generateAccessToken(id) {
	const payload = {id: id};
	return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1h" });
}

function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	
	if (token == null) return res.sendStatus(401);
	
	jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
		if (error) {
			console.error("Token verification failed: ", error);
		}
		req.user = user;
		next();
	});
}

export { genreateAccessToken, authenticateToken };