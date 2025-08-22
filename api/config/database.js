const mongoose=require("mongoose");

require("dotenv").config();

const connectWithDb=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(console.log("connection with db is successfull"))
    .catch(
        (err)=>{
            console.log("can't connect with db");
            console.log(err);
            process.exit(1);
        }
    )
};

module.exports=connectWithDb;