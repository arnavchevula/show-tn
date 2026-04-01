import { validateSecret } from './utils/auth';

export default defineEventHandler(async(event) => {
    validateSecret(event);

    const accountSid = config.env.TWILIO_accountSid;
    const authToken = config.env.TWILIO_authToken;
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
            body: 'Reminder for a show!',
            from: '+18665158356',
            to: '+19085666415'
        })
        .catch(error => { throw error });

})
