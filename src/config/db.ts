import mongoose from 'mongoose';
import { config } from './config';

const connectDb = async () => {
    try {
        //register events 
        console.log("START DB")
        mongoose.connection.on('connected', () => {
            console.log('Connected to database')
        })
        mongoose.connection.on('error', (err) => {
            console.log('error in connecting to database ', err);

        })
        //  connect to database 
        await mongoose.connect(config.databaseUrl)
        console.log("END DB")
    } catch (error) {
        console.log("END DB",error)
        console.log(error);
        process.exit(1);
    }

}
export default connectDb;