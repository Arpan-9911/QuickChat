import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import https from 'https';
import cron from 'node-cron';
import { initSocket } from './socket.js';
import userRoute from './routes/userRoute.js'
import chatsRoute from './routes/chatsRoute.js'

dotenv.config();
const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(express.json({ limit: "100mb", extended: true }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.use('/user', userRoute)
app.use('/chats', chatsRoute)

const BACKEND_URL = process.env.BACKEND_URL
cron.schedule('*/10 * * * *', () => {
  https.get(BACKEND_URL, (res) => {
    console.log(res.statusCode)
  }).on('error', (err) => {
    console.log(err)
  })
})

const PORT = process.env.PORT || 5000;
mongoose
  .connect(`${process.env.MONGO_URI}/QuickChat`)
  .then(() =>
    server.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));