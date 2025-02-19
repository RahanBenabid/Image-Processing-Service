import { createClient } from "@supabase/supabase-js";
import config from "./../config/dotenv.js";

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
        
        console.log("Upload successful! Public URL:", urlData);
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
        
        console.log("Picture deleted successfully from Supabase!");
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
        
        console.log("Picture updated successfully!", data, error, filePath);
        return data;
    } catch (err) {
        console.error("err:", err.message);
        throw err;
    }
}
