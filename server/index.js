import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BucketList from './moduls/BucketList.js';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.get('/', (req, res) => {
    res.send({
        message: "Welcome to Server API!"
    })
});

app.get('/health', (req, res) => {
    res.send({
        status: "OK",
        message: "Server is healthy"
    })
});

app.post('/bucketlists', async (req, res) => {
    const {name, description, priority} = req.body;

    if(!name){
        return res.json({
            success: false,
            message: "Name is required"
        });
    }

    if(!description){
        return res.json({
            success: false,
            message: "Description is required"
        });
    }

    if(priority === undefined){
        return res.json({
            success: false,
            message: "Priority is required"
        });
    }

    const newBucketList = new BucketList({
        name,
        description,
        priority
    });

    try{
        const saveBucketList = await newBucketList.save();

    res.json({
        success: true,
        message: "Bucket List item created sucessfully",
        data: saveBucketList
    });
    }catch(e){
        return res.json({
            success: false,
            message: "Error create bucket list item",
            error: e.message, 
        });
    }
});

app.get('/bucketlists', async (req, res) => {
    const bucketlists = await BucketList.find();

    res.json({
        success: true,
        data: bucketlists,
        message: "Bucket List items fetched successfully"
    })
});

app.patch('/bucketlists/:id/complete', async (req, res) => {
    const {id} = req.params;

    try{
        await BucketList.updateOne({_id : id}, {$set: {isComplete: true}});

        const updatedBucketList = await BucketList.findOne({_id:id});

        return res.json({
            success: true,
            message: "Bucket list item successfully updated",
            data: updatedBucketList
        });
        
    }catch(e){
        return res.json({
            success: true,
            message: "Error updated bucketlist item",
            error: e.message,
        })
    }
})

const connetedToDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    if(conn) {
        console.log("Connected to MongoDB successfully");
    }
}

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);

    connetedToDB();
})