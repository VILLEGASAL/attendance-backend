import bcrypt from "bcrypt";
import { System } from "../models/system.js";
import crypto from "crypto";

import { SESSION } from "../app.js";

export const registerUser = async(req, res) => {

    try {

        const firstname = req.body["firstName"];
        const lastname = req.body["lastName"];
        const username = req.body["username"];
        const password = req.body["password"];

        const hashPassword = await bcrypt.hash(password, 10);
        
        const result = await System.registerUser(firstname, lastname, username, hashPassword);

        res.status(200).send()
        
        
    } catch (error) {

        console.log(error.message);

        res.status(500).send();
    }
}

export const loginUser = async (req, res) => {

    try {

        const user = await System.getUserByUsername(req.body.username);
        const password = req.body["password"];

        const sessionID = crypto.randomUUID();
        
        if(user == null){

            res.status(401).json({

                message: "No user found"
            });

            return;
        }

        if(await bcrypt.compare(password, user.password)){

            SESSION.set(sessionID, user);
            
            res.cookie('sessionID', sessionID, { 
                secure: true,
                httpOnly: true,
                sameSite: "none" }).json(user);
            
            return;
        }
        
    } catch (error) {
        
        console.log(error.message);
    }
}


export const checkDuplicateUsername = async(req, res, next) => {

    try {

        const username = await System.checkDuplicateUsername(req.body["username"]);
        
        return username.length <= 0 ? next() :  res.status(401).json({

            message: "Username already taken"
        });
        
    } catch (error) {
        
        console.log(error.message);
    }
}

export const protectRoute = async (req, res) => {

    const user = SESSION.get(req.cookies.sessionID);

    console.log(user);
    

    if(user == null){

        res.sendStatus(401);
        return;
    }

    res.status(200).json(user);

    return;
}

export const checkIfAuthenticated = async (req, res, next) => {

    const user = SESSION.get(req.cookies.sessionID);

    if(user == null){

        res.sendStatus(401);
        return;
    }

    return next();
}


export const logout = (req, res) => {

    
    const user = req.cookies.sessionID;

    SESSION.delete(user);

    res.sendStatus(401);
}