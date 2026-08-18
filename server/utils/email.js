import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter;
let isTestMode = false;

async function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, USE_TEST_EMAIL } = process.env;

  // Check if credentials are real (not placeholder values)
  const hasRealCredentials = 
    SMTP_USER && 
    SMTP_PASS && 
    !SMTP_USER.includes("your-email") && 
    !SMTP_PASS.includes("your-app-password");

  if (hasRealCredentials && SMTP_HOST) {
    console.log("✓ Using real SMTP credentials");
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } else {
    console.log("⚠ SMTP credentials are not configured. Using Nodemailer test account.");
    console.log("📧 To use real email, update your .env file with actual SMTP credentials.");
    isTestMode = true;
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return transporter;
}

export function isUsingTestMode() {
  return isTestMode;
}

function formatFieldRow(name, value) {
  const rendered = Array.isArray(value) ? value.join(", ") : value;
  return `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>${name}</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${rendered || "—"}</td></tr>`;
}

function buildSubmissionDetails(values) {
  const rows = Object.entries(values)
    .map(([key, value]) => formatFieldRow(key.replace(/([A-Z])/g, " $1"), value))
    .join("\n");

  return `<table style="border-collapse: collapse; width: 100%; max-width: 560px;">${rows}</table>`;
}

function getBaseUrl() {
  return process.env.BACKEND_URL || process.env.FRONTEND_URL || "http://localhost:4000";
}

function buildUserEmailHtml(submission) {
  const appName = process.env.ORG_NAME || "Wings & Tails";
  const confirmUrl = `${getBaseUrl()}/api/forms/confirm/${submission._id}?token=${submission.confirmationToken}`;

  return `
    <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
      <h2 style="color: #1a6b3e;">Thank you for contacting ${appName}</h2>
      <p>Dear ${submission.values.name || "Friend"},</p>
      <p>We received your ${submission.type} request and have recorded the details below.</p>
      <h3 style="margin-bottom: 0.5rem;">Submission details</h3>
      ${buildSubmissionDetails(submission.values)}
      <p style="margin-top: 1rem;">Please confirm your request by clicking the button below.</p>
      <a href="${confirmUrl}" style="display: inline-block; padding: 12px 20px; background: #1a6b3e; color: #fff; text-decoration: none; border-radius: 6px;">Confirm Request</a>
      <p style="margin-top: 1rem;">If you did not submit this request, you can ignore this email.</p>
      <p>Regards,<br/>${appName} Team</p>
    </div>
  `;
}

function buildAdminEmailHtml(submission) {
  const appName = process.env.ORG_NAME || "Wings & Tails";
  return `
    <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
      <h2 style="color: #1a6b3e;">New ${submission.type} request received</h2>
      <p><strong>Submitted by:</strong> ${submission.values.name || "Unknown"}</p>
      <p><strong>Email:</strong> ${submission.values.email || "No email"}</p>
      <h3>Submission details</h3>
      ${buildSubmissionDetails(submission.values)}
      <p>Confirm link: <a href="${getBaseUrl()}/api/forms/confirm/${submission._id}?token=${submission.confirmationToken}">${getBaseUrl()}/api/forms/confirm/${submission._id}?token=${submission.confirmationToken}</a></p>
    </div>
  `;
}

export async function sendSubmissionEmail(submission) {
  const transporter = await getTransporter();
  const fromEmail = process.env.FROM_EMAIL || `no-reply@${process.env.DOMAIN || "wingsandtails.org"}`;
  const adminEmail = process.env.ADMIN_EMAIL;
  const appName = process.env.ORG_NAME || "Wings & Tails";

  const userMail = {
    from: fromEmail,
    to: submission.values.email,
    subject: `Please confirm your ${submission.type} request with ${appName}`,
    html: buildUserEmailHtml(submission),
  };

  const info = await transporter.sendMail(userMail);

  if (adminEmail) {
    await transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      subject: `New ${submission.type} request received at ${appName}`,
      html: buildAdminEmailHtml(submission),
    });
  }

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`Preview message at: ${previewUrl}`);
  }

  return info;
}
