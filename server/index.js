const express = require('express')
const app = express()
const port = 3000
const cookieParser = require('cookie-parser');
require('dotenv').config();
const user=require("./routes/userRoutes");
const product=require("./routes/productRoutes");
const order=require("./routes/orderRoutes");
const cart=require("./routes/cartRoutes");
const { connectDb } = require('./conf/database');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
app.use(cookieParser());
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true

}));
const  bodyParser = require('body-parser');
const { stripeWebhook } = require('./controllers/orderController');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

//  uncaughtException
process.on("uncaughtException", (err) => {
  console.log(`uncaughtException Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// connect Db
connectDb();



// configuration for cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use("/api",user);
app.use("/api",product);
app.use("/api",cart);
app.use("/api",order);
app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

// unhandledRejection
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
});
});


app.use((err, req, res, next) => {
    console.error("Error occured",err); 
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
