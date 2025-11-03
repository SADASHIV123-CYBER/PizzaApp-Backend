import { createTransport } from "nodemailer";
// import {EMAIL_USER, EMAIL_PASS} from './serverConfig.js'
import config from './serverConfig.js'

const {EMAIL_USER, EMAIL_PASS} = config

const emailTransporter  = createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

export default emailTransporter 

