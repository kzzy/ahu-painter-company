import { Request, Response } from 'express';
import { admin, db } from '../config/firebase' 

// Create a new user in the database using the corresponding auth user
const createDBUser = async(req:Request, res:Response) => {
    const {body: {userID, name, email, role}} = req;

    try {
        const userObj = {
            email: email,
            name: name,
            role: role
        };

        db.ref("users/" + userID).set(userObj)

        return res.status(200).json({
            status: "success",
            message: "Created new user successfully in the database",
        })
    } catch (err) {
        return res.status(500).json("Failed to create new user in the database:" + err)
    }
}

// Update user information in the database (Name/Role/Email)
const updateDBUser = async(req:Request, res:Response) => {
    const {body: {name, email, role}, params: {userID}} = req;

    try {
        const userRef = db.ref("users").child(userID);
        const updatedUserObj = {
            email: email,
            name: name,
            role: role
        };

        await userRef.update(updatedUserObj).catch((err) => {
            return res.status(400).json({
                status: "error",
                message: err.message
            })
        })

        return res.status(200).json({
            status: "success",
            message: "Updated user info successfully",
        })
    } catch (err) {
        return res.status(500).json("Failed to update paint stock:" + err)
    }
}

// Delete corresponding auth user in the database
const deleteDBUser = async(req:Request, res:Response) => {
    const {body: {userID}} = req;

    try {
        const userRef = db.ref("users").child(userID);
        await userRef.remove()

        return res.status(200).json({
            status: "success",
            message: "Deleted user from database",
        })
    } catch (err) {
        return res.status(500).json("Failed to delete the user from the database:" + err)
    }
}

// Create new user in Firebase Auth
const createFBAuthUser = async(req:Request, res:Response) => {
    const {body: {email, password}} = req;

    try {
        const newUser = await admin.auth().createUser({
            email: email,
            password: password
        })
        return res.status(200).json({
            status: "success",
            message: "Successfully created a new user in Firebase Auth",
            uid: newUser.uid,
        })
    } catch (err) {
        return res.status(500).json("Failed to create user in Firebase auth:" + err)
    }
}

// Delete an existing user in Firebase Auth
const deleteFBAuthUser = async(req:Request, res:Response) => {
    const {body: {userID}} = req;

    try {
        await admin.auth().deleteUser(userID)
        return res.status(200).json({
            status: "success",
            message: "Deleted user from Firebase Auth",
        })
    } catch (err) {
        return res.status(500).json("Failed to delete the user in Firebase Auth" + err)
    }
}

export { createDBUser, updateDBUser, deleteDBUser, createFBAuthUser, deleteFBAuthUser }