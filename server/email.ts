// Resend integration for sending invoice emails
import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: connectionSettings.settings.from_email
  };
}

interface InvoiceEmailData {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  total: string;
  dueDate: string;
  invoiceUrl?: string;
  pdfBase64?: string;
}

export async function sendInvoiceEmail(data: InvoiceEmailData) {
  const { client, fromEmail } = await getUncachableResendClient();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${data.invoiceNumber}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #3B82F6;
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9fafb;
          padding: 30px 20px;
          border-radius: 0 0 8px 8px;
        }
        .invoice-details {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .label {
          color: #6b7280;
          font-weight: 500;
        }
        .value {
          color: #111827;
          font-weight: 600;
        }
        .button {
          display: inline-block;
          background-color: #3B82F6;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0;">Invoice from ${data.companyName}</h1>
      </div>
      <div class="content">
        <p>Dear ${data.clientName},</p>
        <p>Thank you for your business! Please find your invoice attached as a PDF.</p>
        
        <div class="invoice-details">
          <div class="detail-row">
            <span class="label">Invoice Number:</span>
            <span class="value">${data.invoiceNumber}</span>
          </div>
          <div class="detail-row">
            <span class="label">Total Amount:</span>
            <span class="value">${data.total}</span>
          </div>
          <div class="detail-row">
            <span class="label">Due Date:</span>
            <span class="value">${data.dueDate}</span>
          </div>
        </div>

        ${data.invoiceUrl ? `
          <center>
            <a href="${data.invoiceUrl}" class="button">View Invoice</a>
          </center>
        ` : ''}

        <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>${data.companyName}</p>
      </div>
      <div class="footer">
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </body>
    </html>
  `;

  const emailOptions: any = {
    from: fromEmail,
    to: data.clientEmail,
    subject: `Invoice ${data.invoiceNumber} from ${data.companyName}`,
    html: htmlContent,
  };

  // Add PDF attachment if provided
  if (data.pdfBase64) {
    emailOptions.attachments = [
      {
        filename: `Invoice-${data.invoiceNumber}.pdf`,
        content: data.pdfBase64,
      }
    ];
  }

  const result = await client.emails.send(emailOptions);

  return result;
}
