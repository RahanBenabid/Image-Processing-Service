import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 20,
	standardHeaders: 'draft-8',
	
});

export default limiter;