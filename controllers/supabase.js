import { createClient } from "@supabase/supabase-js";
import { Blob } from "buffer";
import fs from "fs";
import config from "./../config/dotenv.js";

function getBlob(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            else resolve(new Blob([data]));
        });
    });
}

const scriptExample = async (file_name) => {
    const options = {
        schema: 'public',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
    
    const supabase = createClient(
        config.supabaseProjectUrl,
        config.supabaseApiKey || '',
        options,
    )
    
    try {
        const img = "/Users/RahanBen/Downloads/images/heather.jpg";
        const blob = await getBlob(img);
        
        const { data, error } = await supabase.storage
            .from("image-processing")
            .upload(file_name, blob);
            
        if (error) {
            throw error;
        }
        
        const { data: urlData } = supabase.storage
        .from("image-processing")
        .getPublicUrl(file_name);
        
        console.log("Upload successful! Public URL:", urlData);
        return;
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}