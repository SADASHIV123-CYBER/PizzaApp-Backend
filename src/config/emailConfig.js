import { createTransport } from "nodemailer";
import {EMAIL_USER, EMAIL_PASS} from './serverConfig'

const emailTransporter  = createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

export default emailTransporter 

