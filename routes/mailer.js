const router = require("express").Router();
const nodemailer = require("nodemailer");

router.post("/mailer",(req,res) => {
    console.log(req.body.message);
    subject = req.body.subject;
    const output = `
    <h1>Someone wants to contact you</h1>
    <h3>Contact informations:</h3>
    <pre>
    <ul>
        <il>Name: ${req.body.name}</il>
        <il>Email: ${req.body.email}</il>
        <il>Problem: ${req.body.problem}</il>
        <il>Subject: ${req.body.subject}</il>
    </ul>
    </pre>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;
    main();
    async function main() {

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service:'Gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASSWORD, 
              },
            });
      
        
        let info = await transporter.sendMail({
          from: '"NodeBot" <NodeBot@mail.com>', // sender address
          to: "williamnodekea@gmail.com", // list of receivers
          subject: subject, // Subject line
          text: "Contact request", // plain text body
          html: output, // html body
        });
      }
      if(x = 1)
    res.redirect("/")
})

module.exports = {
    router
}