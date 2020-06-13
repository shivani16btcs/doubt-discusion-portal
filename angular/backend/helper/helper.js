const User = require('../Model/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();

exports.sendMail = function( email, res, type ) {
    let mailOptions;
    let statusCode;
    const emailToken = jwt.sign({email: email},
        //process.env.EMAIL_VERIFICATION_KEY,
        "this_is_the_email_verificatin_token",
        { expiresIn: '1h' }
        );
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 567,
        secure: false, 
        auth: {
          user:"check.email.send@gmail.com",//process.env.USER,//"anand.mishra@unthinkable.co",
          pass: "Hrhk@123456",//process.env.PASS//"Anandkmm",//process.env.PASS//"Anandkmmmm" process.env.PASS generated ethereal password
         }
      });

      if ( type === 'verifyUser' ) {
      
        mailOptions = {
            from: "check.email.send@gmail.com",//process.env.USER,//"anand.mishra@unthinkable.co",//process.env.USER, // sender address
            to: email, // list of receivers
            subject:'Please verify your email...',
            text: "Link for Email Verification",
            html: `
            <h3>Please verify Your e mail</h3>
            <a href='http://localhost:4200/verify/${email + '?' + 'token' + '=' + emailToken}'> Please Click here for verfiy your Account.</a>
            `// html body
        };
        statusCode = 400;
        transporter.sendMail(mailOptions, (err, data) => {
          console.log("result is this1 data:-",data);
          console.log("result is this1 err:-",err);

          User.updateOne({ email: email }, { $set: { verificationCode: emailToken } })
          .then( result => {
            console.log("result is this2:-",result);
           res.status(statusCode).json({ message: "Link sent Successfully" })
        })
});
      } else {
     
        mailOptions = {
            from:"check.email.send@gmail.com",//process.env.USER,//"anand.mishra@unthinkable.co",
            to: email, // list of receivers
            subject:'Please verify your email...',// Subject line
            text: "reset password...",// plain text body
            html: `
            <h3>Please verify</h3>
            <a href='http://localhost:4200/resetPassword/${email + '?' + 'token' + '=' + emailToken}'>Click here for verify.</a>
            `// html body
        };

        statusCode = 200;

        transporter.sendMail(mailOptions, (err, data) => {
          console.log("result is this1 data:-",data);
          console.log("result is this1 err:-",err);

          User.updateOne({ email: email }, { $set: { verificationCode: emailToken } })
          .then( result => {
            console.log("result is this2:-",result);
           res.status(statusCode).json({ message: "Link sent Successfully" })
        })
});
        
      }

      // send mail with defined transport object
      // transporter.sendMail(mailOptions, (err, data) => {
      //           console.log("result is this1 data:-",data);
      //           console.log("result is this1 err:-",err);

      //           User.updateOne({ email: email }, { $set: { verificationCode: emailToken } })
      //           .then( result => {
      //             console.log("result is this2:-",result);
      //            res.status(statusCode).json({ message: "Link sent Successfully" })
      //         })
      // });
}
