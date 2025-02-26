
//The Express app is essentially an abstraction over the Node.js HTTP module.
//Route handlers match only if the requested path exactly matches the defined route.
const express = require('express');
const connectDb = require("./config/database");
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user');
const requestRouter = require('./routes/request');
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'OPTIONS', 'PATCH'],  
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],  
  preflightContinue: false,
  optionsSuccessStatus: 200,  
};

// Handle CORS errors globally
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.status(200).json({});
    }

    next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDb().then(() => {
  console.log("Database connection established...");
  app.listen(3540, () => {
    console.log("Server is successfully running at port 3540");
  });
}).catch((err) => {
  console.error("Database can't be connected!!");
});
