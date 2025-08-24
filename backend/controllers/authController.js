import jwt from "jsonwebtoken";
import User from '../models/User.js';
import { validationResult } from "express-validator";

function signToken(user) {
   return jwt.sign( {
    sub: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
   );
   }

   export const  register = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password, role, vesselName, vesselType } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(409).json({ message: "Email already in use" });


        const user = await User.create({ name, email, password, role, vesselName, vesselType });
        const token = signToken(user);
        res.status(201).json({ user, token });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => { 
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const token = signToken(user);
        res.json({user: user.toJSON(),token});
    } catch (error) {
        next(error);
    }

};

export const getProfile = async (req, res) => {
    res.json({ user: req.user });

};