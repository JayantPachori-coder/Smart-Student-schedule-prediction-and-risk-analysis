import PDFDocument from "pdfkit";
import fs from "fs";

export const generatePDF = (data) => {
  const doc = new PDFDocument();
  const path = `uploads/report-${data._id}.pdf`;

  doc.pipe(fs.createWriteStream(path));

  doc.fontSize(20).text("Assignment Report", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Title: ${data.title}`);
  doc.text(`Description: ${data.description}`);
  doc.text(`Status: ${data.status}`);
  doc.text(`Marks: ${data.marks || "Not graded"}`);
  doc.text(`Feedback: ${data.feedback || "Pending"}`);

  doc.end();

  return path;
};