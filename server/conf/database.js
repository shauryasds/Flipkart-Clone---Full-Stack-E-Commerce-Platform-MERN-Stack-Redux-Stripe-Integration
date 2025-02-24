const mongoose = require('mongoose');

exports.connectDb=async()=> {
  await mongoose.connect(process.env.DB_URI).then(()=>{
    console.log("Db connected")
  });

  }