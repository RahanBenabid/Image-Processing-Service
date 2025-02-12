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
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}