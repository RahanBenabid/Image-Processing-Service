import { spawn } from "child_process";
const imageUrl = "/Users/RahanBen/Documents/-code/Image-Processing-Service/image_processing/image_test/image.jpg"
const watermarkUrl = "/Users/RahanBen/Documents/-code/Image-Processing-Service/image_processing/image_test/icon.jpg"


const pythonProcess = spawn('python3', ['./../image_processing/main.py', imageUrl, watermarkUrl]);


//pythonProcess.stdout.on('data', (data) => {
//console.log(`stdout: ${data}`);
//});

// handle any errors from the Python script
pythonProcess.stderr.on('data', (data) => {
	console.error(`stderr: ${data}`);
});


// handle the process closing
pythonProcess.on('close', (code) => {
	console.log(`Python script finished with exit code ${code}`);
});