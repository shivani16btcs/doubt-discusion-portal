const bcrypt = require('bcryptjs');
const User = require('../Model/user');
const Joi = require("@hapi/joi");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const helper = require('../helper/helper');
dotenv.config();

exports.ChangePassword = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
    })
    const { error } = schema.validate(request.body)
    if (error) {
        return response.status(400).send({ isError: true, message: "Validation error", errCode: "SCHEMA_VALIDATION_ERROR" })
    }
    email = req.body.email;
    oldPassword = req.body.oldPassword;
    newPassword = req.body.newPassword;


    // console.log(request.body);
    const user = User.findOne({ email: request.body.email }).then(async user => {
        const isPasswordCorrect = await bcrypt.compare(request.body.oldPassword, user.password)
        if (!isPasswordCorrect) {
            return response.status(400).json({ isError: true, message: "incorrect old Password", errCode: "PASSWORD_UNMATCHED" });
        }
        else {
            console.log(isPasswordCorrect);
            const salt = await bcrypt.genSalt(10)
            const hashedNewPassword = await bcrypt.hash(request.body.newPassword, salt);
            console.log(hashedNewPassword);
            user.password = hashedNewPassword;
            console.log(user.password);
            await user.save();
            response.send(201).json({ message: "Password Updated" });
        }
         console.log("user is", user);
    }

    ).catch(
        err => {
            res.status(400).json({
                isError: true, errCode: 'UPDATION_FAILED', message: 'PASSWORD NOT UPDATED'
            })

        });
}

exports.register = (req, res, next) => {
    console.log("Result in register1:",req.body);
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            console.log("Hash is :",hash)
            user = new User({
                username: req.body.username,
                password: hash,
                email: req.body.email
            })
            console.log("User is :",user)
            user.save()
                .then(result => {
                    console.log("Result in register2:",result);
                    helper.sendMail(result.email, res, 'verifyUser');
                    console.log(result);
                    return res.status(200).json({
                        message: "User Registered Successfully and A verification mail has sent",
                        result: result
                    });
                })
                .catch((error) => {
                    console.log("error is :-",error);
                    res.status(400).json({
                        isError: true, errCode: 'REGISTER_FAILED1', message: 'Registration Failed'
                    })
                });
        }).catch((error) => {
            console.log("error2 is :-",error);
            res.status(400).json({
                isError: true, errCode: 'REGISTER_FAILED2', message: 'Registration Failed'
            })
        });;
}

exports.login = (req, res, next) => {
    let fetchedUser;
    email = req.body.email;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Email does not exists", Iserror: true, errocode: "EMAIL_NOT_EXISTS"
                });
            }
            fetchedUser = user;
             console.log(fetchedUser);
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
             console.log(result, fetchedUser)
            if (!result) {
                return res.status(401).json({
                    isError: true, errCode: 'AUTHENTICATION_FAILD', message: 'authentication fail'
                });
            }
            console.log(result,"fetched User:", fetchedUser)
           // console.log("Token :"+process.env.JWT_KEY);
            
            const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id, username: fetchedUser.username },
              //  process.env.JWT_KEY,
              "this_is_my_secret_key_for_password",
                { expiresIn: '1h' }
            );
            res.status(200).json({
                token: token, expiresIn: 3600, userId: fetchedUser._id,
                username: fetchedUser.username,
                email: fetchedUser.email,
                role: fetchedUser.role,
                message: "Logged in"
            })

        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                isError: true, errCode: 'UNEXPECTED_ERROR', message: 'Not LoggedIn'
            });
        });
}

exports.forgetPassword = (req, res, next) => {  
    email = req.params.emailId;
    const verificationToken = jwt.sign({ email: email }, 
        //process.env.EMAIL_VERIFICATION_KEY,
        "this_is_the_email_verificatin_token",
        { expiresIn: '1h' }
    );
    User.updateOne({ email: email }, { $set: { resetPassToken: verificationToken } })
        .then(result => {
            helper.sendMail(email, res, 'resetPassword');
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                isError: true, errCode: 'AUTHENTICATION_ERR', message: 'Password reset failed'
            })
        });
}


exports.resetPassword = (req, res, next) => {
    email = req.params.emailId;
    token = req.body.token;
    let curUser;
    User.findOne({ email: email })
        .then(userData => {
            if (!userData) {
                return res.status(500).json({
                    message: "Resend Link"
                })
            }
            curUser = userData;
            const tokenVerification = userData.resetPassToken;

            if (!(token === tokenVerification)) {
                return res.status(400).json({
                    isError: true, errCode: 'TOKEN_INVALID', message: 'Token validation failed'
                });
            }

            new Promise((result, error) => {
                jwt.verify(tokenVerification,
                    "this_is_the_email_verificatin_token"
                     //process.env.EMAIL_VERIFICATION_KEY
                     );
                return result();
            }).then(result => {
                    bcrypt.hash(req.body.password, 9)
                        .then(hash => {
                            User.updateOne({ email: email }, { $set: { password: hash, resetPassToken: '' } })
                                .then(result => {
                                    res.status(200).json({ message: "Password updated" })
                                })
                        })
                        .catch(error => {
                            return res.status(500).json({ isError: true, errCode: 'ENCRYPTION_ERR', message: 'Password reset failed' });
                        });
                })
                .catch(error => {
                    User.updateOne({ email: email }, { $set: { resetPassToken: '' } })
                        .then(result => {
                            return res.status(200).json({
                                isError: true, errCode: 'RESET_PWD_FAILED', message: 'Password reset failed'
                            })
                        }).catch(error => {
                            res.status(500).json({ message: "unexpected error" })
                        });
                })
        })
        .catch(error => {
            return res.status(400).json({
                isError: true, errCode: 'RST_PWD_FAILED', message: 'Password reset failed'
            })
        })
}
exports.verify = (req, res, next) => {
    token = req.body.token;
    User.updateOne({ $and: [{ email: req.params.emailId }, { verificationCode: token }] }, { $set: { verified: true } })
        .then(updated => {
            if (updated.n === 0) {
                return res.status(200).json({ message: "already authenticated" })
            }
            User.updateOne({ email: req.params.emailId }, { $set: { verificationCode: '' } })
                .then(result => {
                    return res.status(200).json({ message: "Authenticated user" })
                });
        })
        .catch(error => {
            res.status(400).json({
                isError: true, errCode: 'AUTHENTICATION_FAILED', message: 'Verification failed'
            })
        });
}
exports.getUser = (req, res, next) => {
    User.findOne({ email: req.params.emailId })
        .then(user => {
            if (!user) {
                res.status(400).json({
                    isError: true, errCode: 'AUTHENTICATION_FAILED', message: 'User unauthorized'
                })
            }
            res.status(200).json({
                email: user.email,
                username: user.username
            })
        })
        .catch(error => {
            res.status(500).json({ isError: true, errCode: 'UNEXPECTED_ERR', message: 'invalid email' })
        });
}
exports.updateUser = (req, res, next) => {
    email = req.params.emailId;
    bcrypt.hash(req.body.password, 9)
        .then(hash => {
            username = req.body.username,
                password = hash
            User.updateOne({ email: email }, { $set: { username: username, password: password } })
                .then(result => {
                    return res.status(200).json({ message: "user updated" })
                })
                .catch((error) => {
                    res.status(400).json({ isError: true, errCode: 'WRONG_EMAIL', message: 'you entered wrong email' })
                });
        });
}