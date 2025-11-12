import express from "express";
import connectDB from "./src/config/dbConfig.js";
import serverConfig from "./src/config/serverConfig.js";
import { clearExpiredTempUsers } from "./src/corn/clearTempUsers.js";
import router from "./src/routes/apiRoutes.js";
import cookieParser from "cookie-parser";

const app = express()

app.use(express.json());
app.use(cookieParser())

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