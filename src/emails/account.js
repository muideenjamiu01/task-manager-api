const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'muideenjamiu01@gmail.com',
        pass: '08134529324'
    }
});

const mailOptions = {
    from: 'muideenjamiu01@gmail.com', // sender address
        to: 'muideenjamiu01@gmail.com' , // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world",  // plain text body
        html: "<b>Hello world?</b>", // html body
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});