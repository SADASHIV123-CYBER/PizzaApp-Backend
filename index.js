import express from "express";
import connectDB from "./src/config/dbConfig.js";
import serverConfig from "./src/config/serverConfig.js";

const app = express()

app.get('/ping', (req, res) => {
    return res.json({
        message: 'pong'
    })
});


app.listen(serverConfig.PORT, () => {
    connectDB();
    console.log('server started at port',serverConfig.PORT )
} )