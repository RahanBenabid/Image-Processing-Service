import { spawn } from "child_process";

const processImage = (changes) => {
   const imageUrl = changes.imageUrl;
   const watermarkUrl = changes.watermarkUrl;
   
   const pythonProcess = spawn('python3', ['./../image_processing/main.py', imageUrl, watermarkUrl]);
   
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

export default processImage;