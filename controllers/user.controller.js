import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './../models/user.model.js';

class UserController {
	try {
		const { username, password, email } = req.body;
		
		const existingUser = User.findOne({ email });
	} catch (err) {
		next(err);
	}
}