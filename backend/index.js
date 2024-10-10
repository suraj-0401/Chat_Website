import express from 'express';
import dotenv from 'dotenv';
import cookieParse from 'cookie-parser';
import dbconnect from './db/dbconnect.js';
import userRoutes from './routes/routes.user.js';
import messageRoutes from './routes/routes.message.js';
// configure env
dotenv.config();
const app = express();


// cookies middleware 
app.use(cookieParse());
// others  middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
dbconnect();

// router 
app.use('/api/user',userRoutes);
app.use('/api/message',messageRoutes);

// normal server 
app.get('/', (req, res) => {
    res.send("Server is running");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

