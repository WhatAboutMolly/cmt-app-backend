const nodeoutlook = require("nodejs-nodemailer-outlook");
const getBill = (req, res) => {
  nodeoutlook.sendEmail({
    auth: {
      user: "whataboutmolly@outlook.com",
      pass: "ohmasyndra02121045",
    },
    from: "sender@outlook.com",
    to: "coven.mollyy@gmail.com",
    subject: "Hey you, awesome!",
    html: "<b>This is bold text</b>",
    text: "This is text version!",
    attachments: [],
    onError: (e) => console.log(e),
    onSuccess: (i) => console.log(i),
  });
};

module.exports = { getBill };
