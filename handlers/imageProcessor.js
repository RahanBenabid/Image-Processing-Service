import path from "path";
import { spawn } from "child_process";
import { URL } from "url";

export const processImage = (changes, image_buffer) => {
  const changesJSON = JSON.stringify(changes);
  const currentDir = path.dirname(new URL(import.meta.url).pathname);
  const scriptPath = path.join(currentDir, "../image_processing/main.py");
  console.log("type: ", typeof image_buffer);

  const pythonProcess = spawn("python3", [scriptPath, changesJSON]);

  // write the binary buffer to stdin
  pythonProcess.stdin.write(image_buffer);
  pythonProcess.stdin.end();

  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  // handle any errors from the Python script
  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  // handle the process closing
  pythonProcess.on("close", (code) => {
    console.log(`Python script finished with exit code ${code}`);
  });
};
