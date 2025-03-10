import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load `.env` from the root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default {
  port: process.env.PORT,
  host: process.env.HOST,
  hostUrl: process.env.HOST_URL,
  tokenSecret: process.env.TOKEN_SECRET,
  supabaseProjectUrl: process.env.SUPABASE_PROJECT_URL,
  supabaseApiKey: process.env.SUPABASE_API_KEY,
};
