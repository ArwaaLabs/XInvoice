import jsPDF from "jspdf";

type InvoiceData = {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  status: string;
  template?: string;
  primaryColor?: string;
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo?: string;
  };
  client: {
    name: string;
    email: string;
    address: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    discountType: "percentage" | "fixed";
    taxRate: number;
  }>;
  currency: string;
  notes?: string;
};

function calculateItemTotal(item: { quantity: number; unitPrice: number; discount: number; discountType: "percentage" | "fixed"; taxRate: number }) {
  const subtotal = item.quantity * item.unitPrice;
  let discountAmount = 0;
  if (item.discountType === "percentage") {
    discountAmount = (subtotal * item.discount) / 100;
  } else {
    discountAmount = item.discount;
  }
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (afterDiscount * item.taxRate) / 100;
  return afterDiscount + taxAmount;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 59, g: 130, b: 246 };
}

function generateModernTemplate(doc: jsPDF, data: InvoiceData, subtotal: number, totalDiscount: number, totalTax: number, total: number) {
  const primaryRgb = hexToRgb(data.primaryColor || "#3B82F6");
  
  let logoAdded = false;
  if (data.company.logo) {
    try {
      const format = data.company.logo.includes('data:image/jpeg') || data.company.logo.includes('data:image/jpg') ? 'JPEG' : 'PNG';
      doc.addImage(data.company.logo, format, 20, 15, 30, 15);
      logoAdded = true;
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
    }
  }

  const invoiceTextX = logoAdded ? 55 : 20;
  doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", invoiceTextX, 25);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`#${data.invoiceNumber}`, invoiceTextX, 33);
  
  doc.setFontSize(10);
  doc.text(`Status: ${data.status.toUpperCase()}`, invoiceTextX, 40);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("From:", 20, 60);
  doc.setFont("helvetica", "normal");
  doc.text(data.company.name, 20, 67);
  doc.text(data.company.email, 20, 73);
  doc.text(data.company.phone, 20, 79);
  
  const fromAddressLines = doc.splitTextToSize(data.company.address, 80);
  doc.text(fromAddressLines, 20, 85);

  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 120, 60);
  doc.setFont("helvetica", "normal");
  doc.text(data.client.name, 120, 67);
  doc.text(data.client.email, 120, 73);
  
  const toAddressLines = doc.splitTextToSize(data.client.address, 80);
  doc.text(toAddressLines, 120, 79);

  doc.setFont("helvetica", "bold");
  doc.text("Issue Date:", 20, 110);
  doc.setFont("helvetica", "normal");
  doc.text(data.issueDate.toLocaleDateString(), 50, 110);

  doc.setFont("helvetica", "bold");
  doc.text("Due Date:", 120, 110);
  doc.setFont("helvetica", "normal");
  doc.text(data.dueDate.toLocaleDateString(), 150, 110);

  let yPos = 130;
  
  doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  doc.rect(20, yPos, 170, 8, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Description", 22, yPos + 5);
  doc.text("Qty", 110, yPos + 5);
  doc.text("Rate", 130, yPos + 5);
  doc.text("Amount", 165, yPos + 5);
  
  yPos += 12;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  
  data.items.forEach((item) => {
    const descLines = doc.splitTextToSize(item.description, 85);
    doc.text(descLines, 22, yPos);
    doc.text(item.quantity.toString(), 110, yPos);
    doc.text(`${data.currency}${item.unitPrice.toFixed(2)}`, 130, yPos);
    doc.text(`${data.currency}${calculateItemTotal(item).toFixed(2)}`, 165, yPos);
    yPos += Math.max(descLines.length * 5, 8);
  });

  yPos += 10;
  doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  doc.line(20, yPos, 190, yPos);

  yPos += 10;
  doc.text("Subtotal:", 140, yPos);
  doc.text(`${data.currency}${subtotal.toFixed(2)}`, 175, yPos, { align: "right" });

  if (totalDiscount > 0) {
    yPos += 7;
    doc.text("Discount:", 140, yPos);
    doc.text(`-${data.currency}${totalDiscount.toFixed(2)}`, 175, yPos, { align: "right" });
  }

  if (totalTax > 0) {
    yPos += 7;
    doc.text("Tax:", 140, yPos);
    doc.text(`${data.currency}${totalTax.toFixed(2)}`, 175, yPos, { align: "right" });
  }

  yPos += 10;
  doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  doc.setLineWidth(0.5);
  doc.line(140, yPos, 190, yPos);
  
  yPos += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  doc.text("Total:", 140, yPos);
  doc.text(`${data.currency}${total.toFixed(2)}`, 175, yPos, { align: "right" });

  if (data.notes) {
    yPos += 15;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Notes:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const notesLines = doc.splitTextToSize(data.notes, 170);
    doc.text(notesLines, 20, yPos + 6);
  }
}

function generateClassicTemplate(doc: jsPDF, data: InvoiceData, subtotal: number, totalDiscount: number, totalTax: number, total: number) {
  let logoAdded = false;
  if (data.company.logo) {
    try {
      const format = data.company.logo.includes('data:image/jpeg') || data.company.logo.includes('data:image/jpg') ? 'JPEG' : 'PNG';
      doc.addImage(data.company.logo, format, 20, 15, 25, 12);
      logoAdded = true;
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
    }
  }

  const invoiceTextX = logoAdded ? 50 : 20;
  doc.setFontSize(22);
  doc.setFont("times", "bold");
  doc.text("INVOICE", invoiceTextX, 22);

  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.text(`Invoice #${data.invoiceNumber}`, invoiceTextX, 30);

  doc.setDrawColor(100, 100, 100);
  doc.line(20, 35, 190, 35);

  doc.setFontSize(10);
  doc.setFont("times", "bold");
  doc.text("From:", 20, 50);
  doc.setFont("times", "normal");
  doc.text(data.company.name, 20, 56);
  doc.text(data.company.email, 20, 62);
  doc.text(data.company.phone, 20, 68);
  const fromAddressLines = doc.splitTextToSize(data.company.address, 80);
  doc.text(fromAddressLines, 20, 74);

  doc.setFont("times", "bold");
  doc.text("Bill To:", 120, 50);
  doc.setFont("times", "normal");
  doc.text(data.client.name, 120, 56);
  doc.text(data.client.email, 120, 62);
  const toAddressLines = doc.splitTextToSize(data.client.address, 80);
  doc.text(toAddressLines, 120, 68);

  doc.setFont("times", "bold");
  doc.text("Invoice Date:", 20, 100);
  doc.setFont("times", "normal");
  doc.text(data.issueDate.toLocaleDateString(), 55, 100);

  doc.setFont("times", "bold");
  doc.text("Due Date:", 120, 100);
  doc.setFont("times", "normal");
  doc.text(data.dueDate.toLocaleDateString(), 150, 100);

  doc.setFont("times", "bold");
  doc.text("Status:", 20, 108);
  doc.setFont("times", "normal");
  doc.text(data.status.toUpperCase(), 40, 108);

  let yPos = 120;
  
  doc.setDrawColor(100, 100, 100);
  doc.line(20, yPos, 190, yPos);
  yPos += 8;
  
  doc.setFont("times", "bold");
  doc.setFontSize(9);
  doc.text("Description", 22, yPos);
  doc.text("Qty", 110, yPos);
  doc.text("Rate", 130, yPos);
  doc.text("Amount", 165, yPos);
  
  yPos += 6;
  doc.line(20, yPos, 190, yPos);
  yPos += 6;
  doc.setFont("times", "normal");
  
  data.items.forEach((item) => {
    const descLines = doc.splitTextToSize(item.description, 85);
    doc.text(descLines, 22, yPos);
    doc.text(item.quantity.toString(), 110, yPos);
    doc.text(`${data.currency}${item.unitPrice.toFixed(2)}`, 130, yPos);
    doc.text(`${data.currency}${calculateItemTotal(item).toFixed(2)}`, 165, yPos);
    yPos += Math.max(descLines.length * 5, 8);
  });

  yPos += 5;
  doc.setDrawColor(100, 100, 100);
  doc.line(20, yPos, 190, yPos);

  yPos += 10;
  doc.setFont("times", "normal");
  doc.text("Subtotal:", 140, yPos);
  doc.text(`${data.currency}${subtotal.toFixed(2)}`, 175, yPos, { align: "right" });

  if (totalDiscount > 0) {
    yPos += 7;
    doc.text("Discount:", 140, yPos);
    doc.text(`-${data.currency}${totalDiscount.toFixed(2)}`, 175, yPos, { align: "right" });
  }

  if (totalTax > 0) {
    yPos += 7;
    doc.text("Tax:", 140, yPos);
    doc.text(`${data.currency}${totalTax.toFixed(2)}`, 175, yPos, { align: "right" });
  }

  yPos += 10;
  doc.setLineWidth(0.5);
  doc.line(140, yPos, 190, yPos);
  
  yPos += 8;
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text("Total Due:", 140, yPos);
  doc.text(`${data.currency}${total.toFixed(2)}`, 175, yPos, { align: "right" });

  if (data.notes) {
    yPos += 15;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.text("Notes:", 20, yPos);
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    const notesLines = doc.splitTextToSize(data.notes, 170);
    doc.text(notesLines, 20, yPos + 6);
  }
}

function generateMinimalTemplate(doc: jsPDF, data: InvoiceData, subtotal: number, totalDiscount: number, totalTax: number, total: number) {
  let logoAdded = false;
  if (data.company.logo) {
    try {
      const format = data.company.logo.includes('data:image/jpeg') || data.company.logo.includes('data:image/jpg') ? 'JPEG' : 'PNG';
      doc.addImage(data.company.logo, format, 20, 15, 20, 10);
      logoAdded = true;
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
    }
  }

  const invoiceTextX = logoAdded ? 45 : 20;
  doc.setFontSize(20);
  doc.setFont("helvetica", "normal");
  doc.text("Invoice", invoiceTextX, 20);

  doc.setFontSize(10);
  doc.text(`#${data.invoiceNumber}`, invoiceTextX, 28);

  doc.setFontSize(9);
  doc.text(data.company.name, 20, 45);
  doc.text(data.company.email, 20, 51);
  doc.text(data.company.phone, 20, 57);
  const fromAddressLines = doc.splitTextToSize(data.company.address, 80);
  doc.text(fromAddressLines, 20, 63);

  doc.text(data.client.name, 120, 45);
  doc.text(data.client.email, 120, 51);
  const toAddressLines = doc.splitTextToSize(data.client.address, 80);
  doc.text(toAddressLines, 120, 57);

  doc.text(`Issued: ${data.issueDate.toLocaleDateString()}`, 20, 85);
  doc.text(`Due: ${data.dueDate.toLocaleDateString()}`, 120, 85);
  doc.text(`Status: ${data.status}`, 20, 92);

  let yPos = 105;
  
  doc.setFontSize(8);
  doc.text("Description", 22, yPos);
  doc.text("Qty", 110, yPos);
  doc.text("Rate", 130, yPos);
  doc.text("Amount", 165, yPos);
  
  yPos += 8;
  
  data.items.forEach((item) => {
    const descLines = doc.splitTextToSize(item.description, 85);
    doc.text(descLines, 22, yPos);
    doc.text(item.quantity.toString(), 110, yPos);
    doc.text(`${data.currency}${item.unitPrice.toFixed(2)}`, 130, yPos);
    doc.text(`${data.currency}${calculateItemTotal(item).toFixed(2)}`, 165, yPos);
    yPos += Math.max(descLines.length * 4, 6);
  });

  yPos += 10;
  doc.text("Subtotal:", 140, yPos);
  doc.text(`${data.currency}${subtotal.toFixed(2)}`, 175, yPos, { align: "right" });

  if (totalDiscount > 0) {
    yPos += 6;
    doc.text("Discount:", 140, yPos);
    doc.text(`-${data.currency}${totalDiscount.toFixed(2)}`, 175, yPos, { align: "right" });
  }

  if (totalTax > 0) {
    yPos += 6;
    doc.text("Tax:", 140, yPos);
    doc.text(`${data.currency}${totalTax.toFixed(2)}`, 175, yPos, { align: "right" });
  }

  yPos += 10;
  doc.setFontSize(10);
  doc.text("Total:", 140, yPos);
  doc.text(`${data.currency}${total.toFixed(2)}`, 175, yPos, { align: "right" });

  if (data.notes) {
    yPos += 15;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(8);
    doc.text("Notes:", 20, yPos);
    const notesLines = doc.splitTextToSize(data.notes, 170);
    doc.text(notesLines, 20, yPos + 5);
  }
}

export function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF();
  
  const subtotal = data.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const totalDiscount = data.items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    return (
      sum +
      (item.discountType === "percentage"
        ? (itemSubtotal * item.discount) / 100
        : item.discount)
    );
  }, 0);
  const totalTax = data.items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const discountAmount =
      item.discountType === "percentage"
        ? (itemSubtotal * item.discount) / 100
        : item.discount;
    return sum + ((itemSubtotal - discountAmount) * item.taxRate) / 100;
  }, 0);
  const total = subtotal - totalDiscount + totalTax;

  const template = data.template || "modern";
  
  switch (template) {
    case "classic":
      generateClassicTemplate(doc, data, subtotal, totalDiscount, totalTax, total);
      break;
    case "minimal":
      generateMinimalTemplate(doc, data, subtotal, totalDiscount, totalTax, total);
      break;
    case "modern":
    default:
      generateModernTemplate(doc, data, subtotal, totalDiscount, totalTax, total);
      break;
  }

  doc.save(`invoice-${data.invoiceNumber}.pdf`);
}
