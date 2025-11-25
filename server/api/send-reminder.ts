
export default defineEventHandler(async(event) => {
    
    const accountSid = 'AC76cee0b652e3b0adf303fd7d1449bc74';
    const authToken = 'd38005e50c50b5b870caa8bb05b0a5ea';
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
            body: 'Reminder for a show!',
            from: '+18665158356',
            to: '+19085666415'
        })
        .then(message => console.log(message.sid)).error(error => console.log(error));

})
