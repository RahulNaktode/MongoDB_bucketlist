import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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