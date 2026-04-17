import sendEmail from "./mail.js";

/* =========================
   DUE SOON REMINDER
========================= */
export const sendDueSoonReminder = async (studentEmail, name, title, deadline) => {
  await sendEmail(
    studentEmail,
    "⏰ Assignment Due Soon Reminder",
    `Hi ${name},

Your assignment "${title}" is due soon.

Deadline: ${new Date(deadline).toLocaleString()}

Please complete it before the deadline.

- Assignment Portal`
  );
};

/* =========================
   NOT SUBMITTED WARNING
========================= */
export const sendNotSubmittedWarning = async (studentEmail, name, title) => {
  await sendEmail(
    studentEmail,
    "❌ Assignment Not Submitted",
    `Hi ${name},

You have not submitted the assignment "${title}" before the deadline.

Please submit it as soon as possible to avoid penalties.

- Assignment Portal`
  );
};

/* =========================
   LATE SUBMISSION ALERT
========================= */
export const sendLateSubmissionAlert = async (studentEmail, name, title) => {
  await sendEmail(
    studentEmail,
    "⚠️ Late Submission Alert",
    `Hi ${name},

Your submission for "${title}" was received AFTER the deadline.

This may affect your grading.

- Assignment Portal`
  );
};