import { Request, Response } from 'express';
import { db } from '../config/firebase' 

// GET all paints
const getStock = async(req:Request, res:Response) => {
    db.ref("paints").get().then((snapshot) => {
        if (snapshot.exists()) {
            return res.status(200).json(snapshot)
        } else {
            return res.status(500).json("Something went wrong with getPaint")
        }
    }) 
}

// PATCH paint entry
const updateStock = async(req:Request, res:Response) => {
    const {body: {quantity, status}, params: {colour}} = req;

    try {
        const colourKey = db.ref("paints").child(colour);
        const updatedPaintStockObj = {
            quantity: quantity,
            status: status,
        };

        await colourKey.update(updatedPaintStockObj).catch((err) => {
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

// GET last timestamp and author
const getLastUpdate = async(req:Request, res:Response) => {
    db.ref("updatehistory").get().then((snapshot) => {
        if (snapshot.exists()) {
            return res.status(200).json(snapshot)
        } else {
            return res.status(500).json("Something went wrong with getLastUpdate")
        }
    }) 
}

export { getStock, updateStock, getLastUpdate }