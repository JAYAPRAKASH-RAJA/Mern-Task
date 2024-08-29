import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'
import { createError } from '../../Error.js'

const router = express.Router();

//LogOut
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Here, you can mark the user as logged out or inactive in the database
    await User.findByIdAndUpdate(userId, { active: false });

    res.clearCookie('access_token').status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    res.status(200).send("User has been created");
  } catch (err) {
    next(err);
  }
});

router.post('/signin', async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User Not Found"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong Password"));

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) throw new Error("JWT secret key is not defined");

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
    const userObject = user.toObject();
    const { password, ...others } = userObject;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  //This flag ensures the cookie is only sent over HTTPS
    }).status(200).json(others);
  } catch (err) {
    next(err);
  }
});

export default router;
