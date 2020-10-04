

// const nodemailer = require("nodemailer");
// const mailGun = require("nodemailer-mailgun-transport");
// const { getMaxListeners } = require("../events/schema");

// const auth = {
//   auth: {
//     api_key: process.env.API_KEY,
//     domain: process.env.DOMAIN_NAME,
//   },
// };


// const transporter = nodemailer.createTransport(mailGun(auth));

// const sendMail = (email, name, phone, text, cb) => {
//   const mailOptions = {
//     from: email, 
//     to: "nchombuayvta@gmail.com", 
//     name,
//     phone,
//     text,
//   };

//   transporter.sendMail(mailOptions, function (err, data) {
//     if (err) {
//       return cb(err, null);
//     }
//     return cb(null, data);
//   });
// };

// module.exports = sendMail;
