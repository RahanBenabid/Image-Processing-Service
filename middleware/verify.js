import User from "./../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verify = async (req, res, next) => {
	try {
		const cookies = req.headers.cookie;
		if (!cookies) {
			return res.status(401).json({
				message: "No session found, please login"
			});
		}
		
		const sessionCookie = cookies.split(";").find((cookie) => cookie.trim().startsWith("SessionID="));
		
		if (!sessionCookie) {
			return res.status(401).json({
				message: 'No session found, please login'
			});
		}
		
		const token = sessionCookie.split("=")[1];
		
		let decoded;
		
		try {
			decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		} catch (jwtError) {
			if (jwtError.name === "TokenExpiredError") {
				return res
				.status(401)
				.json({ message: "Session expired. Please login again" });
			}
			return res
			.status(401)
			.json({ message: "Invalid session. Please login again" });
		}
		
		const user = await User.findById(decoded.id);
		
		const user = await User.findById(decoded.id);
		
		if (!user) {
			return res
			.status(401)
			.json({ message: "User not found. Please login again" });
		}
		
		const { password, ...userData } = user._doc;
		req.user = userData;
		next();
		
	} catch (err) {
		console.error("Verification error:", err);
		res.status(500).json({
			status: "error",
			code: 500,
			message; "Inernal Server Error",
		});
	}
};
