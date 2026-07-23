import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Renders the given DOM element to a multi-page A4 PDF and triggers download.
 *
 * @param {HTMLElement} element – The `.report-viewport` container element
 * @param {string}      filename – e.g. "Energy-Assessment-Report.pdf"
 */
export default async function generatePdf(element, filename = "Energy-Assessment-Report.pdf") {
  if (!element) throw new Error("generatePdf: element is required");

  // A4 dimensions in mm
  const A4_W = 210;
  const A4_H = 297;

  // Render to canvas at high DPI for crisp text
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    // Ensure the full element is captured, even if offscreen
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");
  const imgW = canvas.width;
  const imgH = canvas.height;

  // Calculate how many A4 pages we need
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pdfW = A4_W;
  const pdfH = (imgH * pdfW) / imgW; // scaled height
  const pageH = A4_H;

  let position = 0;
  let remainingH = pdfH;

  // First page
  pdf.addImage(imgData, "PNG", 0, position, pdfW, pdfH);
  remainingH -= pageH;

  // Additional pages if needed
  while (remainingH > 0) {
    position -= pageH;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfW, pdfH);
    remainingH -= pageH;
  }

  pdf.save(filename);
}
