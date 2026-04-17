import PDFDocument from "pdfkit";

export const generateSchedulePDF = (schedule) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    doc.fontSize(18).text("Smart Study Schedule", { align: "center" });
    doc.moveDown();

    schedule.forEach((sub) => {
      doc.fontSize(14).text(`Subject: ${sub.name}`);
      doc.text(`Total Hours: ${sub.predictedHours}`);

      sub.blockHours.forEach((b) => {
        doc.text(`- ${b.timeBlock}: ${b.hours} hrs`);
      });

      doc.moveDown();
    });

    doc.end();
  });
};