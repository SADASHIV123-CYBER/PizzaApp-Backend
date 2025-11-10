import express from "express";
import connectDB from "./src/config/dbConfig.js";
import serverConfig from "./src/config/serverConfig.js";
import router from "./src/routes/v1/userRoutes.js";
import { clearExpiredTempUsers } from "./src/corn/clearTempUsers.js";

const app = express()

app.use(express.json());

app.get('/ping', (req, res) => {
    return res.json({
        message: 'pong'
    })
});

app.use('/api', router);

clearExpiredTempUsers();

app.listen(serverConfig.PORT, () => {
    connectDB();
    console.log('server started at port',serverConfig.PORT )
} )