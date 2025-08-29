import { validationResult } from "express-validator";
import User from "../models/User.js";

//get all users 
export const listUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
};

//get single user 
export const getUserById = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found"});
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

//create user 
export const createUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name , email, password, role, vesselName, vesselType } = req.body;

        // check email is unique or not 
        const exitingUser = await User.findOne ({ email });
        if (exitingUser) return res.status(400).json({ message: "Email already exists"});
        
        const user = await User.create({name, email, password, role, vesselName, vesselType});
        res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
};

// update user 
export const updateUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password, role, vesselName, vesselType } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {name, role, vesselName, vesselType, isActive},
            {
                new: true, runValidators: true }
            );

            if (!user) return res.status(404).json({ message: "User not found" });
            res.json({ user});
        }catch(err) {
            next(err);
        }
    };
    
    //delete user 
    export const deleteUser = async (req, res, next) => {
        try {
            const deleted_user = await User.findByIdAndDelete(req.params.id);
            if (!deleted_user) return res.status(404).json({ message: "User not found" });
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
