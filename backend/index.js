import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import loginroute from './src/controllers/loginmiddleware.js';
import users from './src/controllers/users.js';
import employeeRoutes from './src/routes/employee.js'

dotenv.config();
const app = express();
const port=process.env.PORT || 3000;


// Middlewares allow request from specific origins
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

const connect = async () => {
  try {
    const mongoUri = process.env.MONGODB;

    if (!mongoUri) {
      throw new Error("MongoDB URI is not defined");
    }
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};


app.use("/api/auth", loginroute);
app.use("/api/employees", employeeRoutes);
app.use("/api", employeeRoutes);
app.use("/api/users", users);


app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message
  });
});

app.listen(port, () => {
  connect();
  console.log('Server is running on port 3000');
});
