import { Request, Response } from 'express';
import { db } from '../config/firebase' 

// Get all paints (quantity and status)
const getStock = async(req:Request, res:Response) => {
    try {
        const snapshot = await db.ref("paints").get()
        return res.status(200).json(snapshot)
    } catch (err) {
        return res.status(500).json("Something went wrong with getPaint:")
    }
}

// Update paint quantity and status
const updateStock = async(req:Request, res:Response) => {
    const {body: {quantity, status}, params: {colour}} = req;

    try {
        const colourRef = db.ref("paints").child(colour);
        const updatedPaintStockObj = {
            quantity: quantity,
            status: status,
        };

        await colourRef.update(updatedPaintStockObj).catch((err) => {
            return res.status(400).json({
                status: "error",
                message: err.message
            })
        })

        return res.status(200).json({
            status: "success",
            message: "Paint stock updated successfully",
            data: updatedPaintStockObj
        })
    } catch (err) {
        return res.status(500).json("Failed to update paint stock")
    }
}

// Get last action history (author and timestamp)
const getLastUpdate = async(req:Request, res:Response) => {
    try {
        const snapshot = await db.ref("updatehistory").get()
        return res.status(200).json(snapshot)
    } catch (err) {
        return res.status(500).json("Something went wrong with getLastUpdate")
    }
}

// Update last action history with author and timestamp
const updateLastUpdate = async(req:Request, res:Response) => {
    const {body: {author, timestamp}} = req;

    try {
        const ref = db.ref("updatehistory");
        const updatedHistoryObj = {
            author: author,
            timestamp: timestamp,
        };

        await ref.update(updatedHistoryObj).catch((err) => {
            return res.status(400).json({
                status: "error",
                message: err.message
            })
        })

        return res.status(200).json({
            status: "success",
            message: "Last save history updated successfully",
            data: updatedHistoryObj
        })
    } catch (err) {
        return res.status(500).json("Failed to update history")
    }
}

export { getStock, updateStock, getLastUpdate, updateLastUpdate }