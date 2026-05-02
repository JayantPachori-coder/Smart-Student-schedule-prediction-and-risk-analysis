import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "australiachampions2023@gmail.com",
    pass: "dylx jque tahj utog"
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"LMS System" <australiachampions2023@gmail.com>',
      to,
      subject,
      text
    });
  } catch (err) {
    console.error("Email Error:", err);
  }
};

export default sendEmail;
