  require('dotenv').config();

  const mongoose = require('mongoose');
  const dbName = process.env.DB_NAME;
  const username = process.env.DB_USER ;
  const ip = process.env.ip;
  const dbport = process.env.dbport;
  const password = encodeURIComponent(process.env.DB_PASSWORD)
  // const uri = `mongodb://${username}:${password}@${ip}:${dbport}/${dbName}?authSource=admin`;
  
  const uri = `mongodb://${ip}:${dbport}/${dbName}?authSource=admin`;

  mongoose.set("strictQuery", false);
  mongoose.connect(uri, {
  
    //   useNewUrlParser: true
  }).then(() => {
      console.log('mongoose connected successfully',{dbName})
      // user_data.getAdvance()
  }).catch((e) => {
      console.log("mongoose error", e)
  })
 
