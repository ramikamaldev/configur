import mongoose from "mongoose";

export function connectToConfigurMongodb() {
   return new Promise(async function (resolve, reject) { 
       console.log("Awaiting MongoDB connection")
        await mongoose.connect(process.env.CONFIGUR_MONGODB_DEV as string, { useNewUrlParser: true, useUnifiedTopology: true}, function (mongooseConnectionErr) {
            let mongooseApi = mongoose.connection;
            if (!mongooseConnectionErr) {
                console.log("Connected to MongoDB through Mongoose!");
                return resolve("connected");
            }
            console.log(mongooseConnectionErr);
            return reject("Failed to to connect to MongoDB through Mongoose!");
        });

    })
}