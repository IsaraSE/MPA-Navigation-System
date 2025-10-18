import jwt from "jsonwebtoken";
import User from '../models/User.js';

export default async function auth(req, res, next) {
    try{
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer") ? header.slice(7): null;
        if(!token) return res.status(401).json({message: "Unauthorized: No token provided"});
        
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.sub);
        if (!user) {
            return res.status(401).json({message: "Unauthorized: Invalid user"});
        }

        req.user = user;
        next();
    } catch {
        return res.status(401).json({message: "Unauthorized: Invalid token"});
    }

}