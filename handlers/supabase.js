import { createClient } from "@supabase/supabase-js";
import config from "./../config/dotenv.js";
import fs from "fs/promises";

export const saveImage = async (fileBuffer, fileName) => {
    const supabase = createClient(
        config.supabaseProjectUrl,
        config.supabaseApiKey,
        {
            schema: 'public',
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    );
    
    try {
        
        const { data, error } = await supabase.storage
            .from("image-processing")
            .upload(fileName, fileBuffer);
            
        if (error) {
            throw error;
        }
        
        const { data: urlData } = supabase.storage
            .from("image-processing")
            .getPublicUrl(fileName);
        
        return urlData;
    } catch (err) {
        console.error("err:", err.message);
        throw err;
    }
}

export const deleteImage = async (filePath) => {
    if (!filePath) {
        throw new Error("File path is required");
    }
    
    const supabase = createClient(
        config.supabaseProjectUrl,
        config.supabaseApiKey,
        {
            schema: 'public',
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    );
    
    try {
        const { data, error } = await supabase.storage
            .from('image-processing')
            .remove([filePath]);
        
        if (error) {
            console.error("Supabase deletion error:", error);
            throw error;
        }
        
        if (!data) {
            throw new Error("No deletion confirmation received from Supabase");
        }
        
        return { success: true };
    } catch (err) {
        console.error("Deletion error:", err.message);
        throw err;
    }
}

export const replaceImage = async (filePath, fileBuffer) => {
    if (!filePath) {
        throw new Error("File path is required");
    }
    
    const supabase = createClient(
        config.supabaseProjectUrl,
        config.supabaseApiKey,
        {
            schema: 'public',
            autoRefreshToken: true,
            persistSession: true,
            detectSessionUrl: false,
        },
    );
    
    try {
        const { data, error } = await supabase
        .storage
        .from('image-processing')
        .update(filePath, fileBuffer);
        
        if (error) {
            throw error;
        }
        
        return data;
    } catch (err) {
        console.error("err:", err.message);
        throw err;
    }
}

export const downloadImage = async (filePath) => {
    const supabase = createClient(
        config.supabaseProjectUrl,
        config.supabaseApiKey
    );
    
    try {
        const { data, error } = await supabase.storage
            .from('image-processing')
            .download(filePath);
        
        if (error) {
            throw error;
        }
        
        const buffer = Buffer.from(await data.arrayBuffer());
        const filename = filePath.split('/').pop();
        
//      console.log(filename, buffer);
        await fs.writeFile(`/Users/RahanBen/Downloads/test/${filename}`, buffer);
        
        return buffer;
    } catch (err) {
        console.error("err:", err);
        throw err;
    }
    
}
