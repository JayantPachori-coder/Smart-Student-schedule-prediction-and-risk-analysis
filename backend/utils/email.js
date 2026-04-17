import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAssignmentEmail = async (emails, assignment) => {
  await transporter.sendMail({
    from: "LMS System",
    to: emails.join(","),
    subject: `📢 New Assignment: ${assignment.title}`,
    text: `
New Assignment Assigned!

Title: ${assignment.title}
Description: ${assignment.description}
Deadline: ${assignment.deadline}
    `,
  });
};