import mongoose from "mongoose";
import config from "./config";
import app from './app'

async function bootstrap() {
    try {
        await mongoose.connect(config.database_urll as string)
        console.log("Database connected succesfully");

        app.listen(config.port, () => {
            console.log(`Application listening on port ${config.port}`)
          })
        
    } catch (error) {
        console.log("Failed to connect database", error);
        
    }
}

bootstrap()