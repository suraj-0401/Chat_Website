import express from 'express';
import {signup,login,logout} from '../controllers/controllers.user.js'
const router = express.Router();

// Signup route
router.post('/signup',signup);

// login routes 
router.post('/login',login);

// logout routes 
router.post('/logout',logout);

export default router;
