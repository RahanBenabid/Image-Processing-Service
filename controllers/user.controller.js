import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./../models/user.model.js";
import Picture from "./../models/picture.model.js";
import dotenv from "dotenv";

dotenv.config();

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      return next(err);
    }
  }

  async getUserById(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await User.findOne({ _id: userId });
      res.status(200).json({ user: user });
    } catch (err) {
      return next(err);
    }
  }

  async createUser(req, res, next) {
    try {
      const { username, password, email } = req.body;

      // make sure the user doesn't exist
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username: username,
        password: hashedPassword,
        email: email,
      });

      const savedUser = await newUser.save();
      res
        .status(201)
        .json({ message: "User created successfully", user: savedUser });
    } catch (err) {
      return next(err);
    }
  }

  async updateUserById(req, res, next) {
    try {
      const userId = req.params.id;

      if (req.user.userId !== userId) {
        return res
          .status(403)
          .json({ message: "you can only update your own account" });
      }

      const { email, username } = req.body;

      const data = {};
      if (email) data.email = email;
      if (username) data.username = username;

      const result = await User.findOneAndUpdate(
        { _id: userId },
        { $set: data },
        { new: true, runValidators: true },
      );

      if (!result) return res.status(404).json({ message: "User not found" });

      res.status(200).json({
        message: "User updated successfully",
        user: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  async deleteUserById(req, res, next) {
    try {
      const userId = req.params.id;
      const result = await User.deleteOne({ _id: userId });
      if (result.deletedCount === 0) {
        res.status(404).json({ message: "Deletion failed" });
      }
      res.status(204).send();
    } catch (err) {
      return next(err);
    }
  }

  async register(req, res, next) {
    try {
      const { username, password, email } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        password: hashedPassword,
        email,
      });

      const savedUser = await newUser.save();

      const token = jwt.sign(
        {
          userId: savedUser._id,
          username: savedUser.username,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "1h" },
      );

      res
        .status(201)
        .json({ message: "User created successfully", user: savedUser, token });
    } catch (err) {
      return next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password or email" });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "1h" },
      );

      res.status(200).json({ message: "Login successfully", token });
    } catch (err) {
      return next(err);
    }
  }

  async listAllImages(req, res, next) {
    try {
      const user_id = req.user.userId;

      const pictures = await Picture.find({
        user_id: user_id,
      });

      res.status(200).json({
        success: true,
        pictures: pictures,
      });
    } catch (err) {
      return next(err);
    }
  }

  async listUserPictures(req, res, next) {
    try {
      const userId = req.params.id;

      // if (req.user.userId !== userId) return res.sendStatus(403);

      const userPictures = await Picture.find({
        user_id: userId,
      });

      console.log(userPictures);

      if (!userId)
        return res.status(400).json({
          success: false,
          message: "no user id provided",
        });

      return res.status(200).json({
        success: true,
        pictures: userPictures,
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default new UserController();

/**
 * TODO: Security & Authentication Improvements
 * - Add rate limiting middleware for all routes, especially login
 * - Implement request validation middleware using Joi or express-validator
 * - Add password strength requirements (min length, special chars, numbers)
 * - Implement account lockout after X failed login attempts
 * - Add refresh token functionality with JWT
 * - Set up proper session management
 * - Add 2FA support
 * - Implement CSRF protection
 *
 * TODO: Error Handling & Logging
 * - Set up a proper logging system (winston/pino)
 * - Add request ID tracking
 * - Implement error monitoring integration (Sentry/New Relic)
 * - Add detailed audit logging for sensitive operations
 *
 * TODO: Performance & Scaling
 * - Add caching layer (Redis) for frequently accessed data
 * - Implement connection pooling for database
 * - Add query optimization for user lookups
 * - Implement proper indexing strategy
 *
 * TODO: Code Quality & Maintenance
 * - Add input sanitization
 * - Implement proper TypeScript types
 * - Add comprehensive unit tests
 * - Set up integration tests
 * - Add API documentation (Swagger/OpenAPI)
 * - Implement proper CI/CD pipeline
 *
 * TODO: Features & Functionality
 * - Add password reset functionality
 * - Implement email verification
 * - Add user profile management
 * - Implement role-based access control (RBAC)
 * - Add API versioning
 * - Implement proper user session management
 *
 * TODO: Monitoring & Maintenance
 * - Set up health check endpoints
 * - Implement proper metrics collection
 * - Add performance monitoring
 * - Set up automated backup system
 * - Implement proper database migrations
 */
