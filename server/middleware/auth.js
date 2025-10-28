import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req,res,next)=>{

    try {
        const {userId} = req.auth();
        const user = await clerkClient.users.getUser(userId);
        if(user.privateMetadata.role !== "admin"){
            return res.json({
                success:false,
                message:"You are not authorized to access this route"})
        }
        
        next();
    } catch (error) {
        res.json({
      success: false,
      message: error.message,
    });
    }
}