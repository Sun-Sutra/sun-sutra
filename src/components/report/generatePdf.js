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

  // Temporarily bring container to top 0 offscreen so fonts, images, and flexbox layouts compute 100% accurately
  const originalStyle = {
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
    opacity: element.style.opacity,
    zIndex: element.style.zIndex,
  };

  element.style.position = "fixed";
  element.style.top = "0";
  element.style.left = "0";
  element.style.opacity = "1";
  element.style.zIndex = "-9999";

  // Allow browser paint cycle to settle fonts & images
  await new Promise((r) => setTimeout(r, 250));

  try {
    // Render to canvas at 2x DPI scale for ultra-crisp executive print quality
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgW = canvas.width;
    const imgH = canvas.height;

    // A4 dimensions in mm
    const A4_W = 210;
    const A4_H = 297;

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfW = A4_W;
    const pdfH = (imgH * pdfW) / imgW;

    let position = 0;
    let remainingH = pdfH;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, pdfW, pdfH);
    remainingH -= A4_H;

    // Additional pages if report spans multiple pages
    while (remainingH > 5) {
      position -= A4_H;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfW, pdfH);
      remainingH -= A4_H;
    }

    pdf.save(filename);
  } finally {
    // Restore original DOM positioning
    element.style.position = originalStyle.position;
    element.style.left = originalStyle.left;
    element.style.top = originalStyle.top;
    element.style.opacity = originalStyle.opacity;
    element.style.zIndex = originalStyle.zIndex;
  }
}
