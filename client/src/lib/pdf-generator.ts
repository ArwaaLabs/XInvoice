import jsPDF from "jspdf";

type InvoiceData = {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  status: string;
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
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

export function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF();
  
  const calculateItemTotal = (item: typeof data.items[0]) => {
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
  };

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

  doc.setFontSize(24);
  doc.text("INVOICE", 20, 20);

  doc.setFontSize(12);
  doc.text(`#${data.invoiceNumber}`, 20, 30);
  
  doc.setFontSize(10);
  doc.text(`Status: ${data.status.toUpperCase()}`, 20, 38);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("From:", 20, 55);
  doc.setFont("helvetica", "normal");
  doc.text(data.company.name, 20, 62);
  doc.text(data.company.email, 20, 68);
  doc.text(data.company.phone, 20, 74);
  
  const fromAddressLines = doc.splitTextToSize(data.company.address, 80);
  doc.text(fromAddressLines, 20, 80);

  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 120, 55);
  doc.setFont("helvetica", "normal");
  doc.text(data.client.name, 120, 62);
  doc.text(data.client.email, 120, 68);
  
  const toAddressLines = doc.splitTextToSize(data.client.address, 80);
  doc.text(toAddressLines, 120, 74);

  doc.setFont("helvetica", "bold");
  doc.text("Issue Date:", 20, 105);
  doc.setFont("helvetica", "normal");
  doc.text(data.issueDate.toLocaleDateString(), 50, 105);

  doc.setFont("helvetica", "bold");
  doc.text("Due Date:", 120, 105);
  doc.setFont("helvetica", "normal");
  doc.text(data.dueDate.toLocaleDateString(), 150, 105);

  let yPos = 125;
  
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos, 170, 8, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Description", 22, yPos + 5);
  doc.text("Qty", 110, yPos + 5);
  doc.text("Rate", 130, yPos + 5);
  doc.text("Amount", 165, yPos + 5);
  
  yPos += 12;
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
  doc.setDrawColor(200, 200, 200);
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
  doc.line(140, yPos, 190, yPos);
  
  yPos += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total:", 140, yPos);
  doc.text(`${data.currency}${total.toFixed(2)}`, 175, yPos, { align: "right" });

  if (data.notes) {
    yPos += 15;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Notes:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const notesLines = doc.splitTextToSize(data.notes, 170);
    doc.text(notesLines, 20, yPos + 6);
  }

  doc.save(`invoice-${data.invoiceNumber}.pdf`);
}
