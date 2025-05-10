import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

export const processImage = (imageBuffer, changes) => {
  return new Promise((resolve, reject) => {
    const changesJSON = JSON.stringify(changes);
    
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const scriptPath = path.join(currentDir, "../image_processing/main.py");

    const pythonProcess = spawn("python3", [scriptPath, changesJSON]);

    // Send image buffer to Python script via stdin
    pythonProcess.stdin.write(imageBuffer);
    pythonProcess.stdin.end();

    const chunks = [];

    // Collect image binary data from stdout
    pythonProcess.stdout.on("data", (chunk) => {
      chunks.push(chunk);
    });

    pythonProcess.stdout.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer); // This buffer is the transformed image
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on("error", (err) => {
      reject(err);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}`));
      }
    });
  });
};
