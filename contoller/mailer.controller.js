const nodemailer = require("nodemailer");

require("dotenv").config();

const getBill = (req, res) => {
  const { userEmail } = req.body;

  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1 and format to two digits
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${day}-${month}-${year}`;

  let message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Visite medicale",
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>mail</title>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap"
    />

    <style>
      body {
        font-family: "Poppins", sans-serif;
        margin: 0;
        padding: 50px;
        color : #000;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .sender {
        font-size: 16px;
        font-weight: 500;
      }

      .recipient {
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
        margin-bottom: 30px;
      }

      .Date {
        text-align : end;
      }

      .signature {
        text-align: end;
        font-weight: 500;
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <img src="https://sonatrach.com/img/header/sonatrach.png" />
        <div>
          <p class="sender">DIRECTION GENERALE</p>
          <p class="sender">CENTRE MEDECINE DU TRAVAIL</p>
        </div>
      </div>
      <div class="Date">Alger, le ${formattedDate}</div>
    </div>
    <div class="recipient">
      <div>
        <p>M.Mme, Melle :</p>
        <p>Dep:</p>
      </div>
    </div>

    <div class="content">
      <p>
        Nous vous informons que votre visite médicale périodique programmée pour
        le :
      </p>
      <p>
        Nous vous rappelons que conformément aux dispositions de la loi en
        vigueur régissant la médecine du travail. Vous etes tenu de répondre à
        la présente convocation.
      </p>

      <p class="signature">Le Médecin du Travail.</p>
    </div>
  </body>
</html>
`,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: "you should receive an email",
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });

  // res.status(201).json("getBill Successfully...!");
};

module.exports = { getBill };
