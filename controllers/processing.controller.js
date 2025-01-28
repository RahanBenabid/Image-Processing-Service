import path from "path";
import { spawn } from "child_process";
import { URL } from 'url';

export const processImage = (changes) => {
   const changesJSON = JSON.stringify(changes);
   const currentDir = path.dirname(new URL(import.meta.url).pathname);
   const scriptPath = path.join(currentDir, '../image_processing/main.py');

   // Pass the JSON string as an argument
   const pythonProcess = spawn('python3', [scriptPath, changesJSON]);

   pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
   });

   // handle any errors from the Python script
   pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
   });

   // handle the process closing
   pythonProcess.on('close', (code) => {
      console.log(`Python script finished with exit code ${code}`);
   });
}
