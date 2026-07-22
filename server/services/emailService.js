import nodemailer from 'nodemailer';

// Email configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const ALERT_EMAIL = process.env.ALERT_EMAIL || 'mayankmaharshi01@gmail.com';

/**
 * Create Nodemailer transporter
 * @returns {Object} Nodemailer transporter
 */
const createTransporter = () => {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('⚠️  Email credentials not configured. Email notifications disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // Use TLS
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
};

/**
 * Send health alert email
 * @param {Object} profile - User profile data
 * @param {Object} oldProfile - Previous profile data (optional, for comparison)
 * @returns {Promise<Object>} Email send result
 */
export const sendHealthAlertEmail = async (profile, oldProfile = null) => {
  try {
    // Check if email is configured
    const transporter = createTransporter();
    if (!transporter) {
      console.log('ℹ️  Email not configured, skipping notification');
      return { success: false, message: 'Email not configured' };
    }

    // Check if disease is None
    const medicalConditions = profile.medicalConditions || [];
    const hasDisease = medicalConditions.some(condition => condition !== 'None');

    if (!hasDisease) {
      console.log('✓ Disease = None, no email required');
      return { success: true, message: 'No email required', skipped: true };
    }

    // Check if disease changed (prevent duplicate emails)
    if (oldProfile && oldProfile.medicalConditions) {
      const oldDiseases = oldProfile.medicalConditions.filter(c => c !== 'None');
      const newDiseases = medicalConditions.filter(c => c !== 'None');
      
      // If diseases are the same, don't send email
      if (JSON.stringify(oldDiseases.sort()) === JSON.stringify(newDiseases.sort())) {
        console.log('✓ Disease unchanged, no duplicate email sent');
        return { success: true, message: 'Disease unchanged', skipped: true };
      }
    }

    // Get primary disease (first non-None condition)
    const disease = medicalConditions.find(c => c !== 'None') || 'Not specified';

    // Format date
    const updateTime = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Email content
    const subject = `🚨 DigiHup Health Alert - Citizen Health Update`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc3545; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; font-size: 16px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Health Alert Notification</h1>
          </div>
          <div class="content">
            <p>A citizen has updated their health information.</p>
            
            <div class="field">
              <div class="label">User Name:</div>
              <div class="value">${profile.fullName || 'Not provided'}</div>
            </div>

            <div class="field">
              <div class="label">Disease:</div>
              <div class="value">${disease}</div>
            </div>

            <div class="field">
              <div class="label">Mobile Number:</div>
              <div class="value">${profile.mobileNumber || 'Not provided'}</div>
            </div>

            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${profile.email || 'Not provided'}</div>
            </div>

            <div class="field">
              <div class="label">Ward:</div>
              <div class="value">${profile.wardNumber ? `Ward ${profile.wardNumber}` : 'Not provided'}</div>
            </div>

            <div class="field">
              <div class="label">Update Time:</div>
              <div class="value">${updateTime}</div>
            </div>

            <div class="footer">
              <p>This is an automated notification from DigiHup Health Alert System.</p>
              <p>Please review this information if required.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const mailOptions = {
      from: SMTP_USER,
      to: ALERT_EMAIL,
      subject: subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);

    console.log('✓ Health Alert Email Sent Successfully');
    console.log(`  To: ${ALERT_EMAIL}`);
    console.log(`  Disease: ${disease}`);
    console.log(`  User: ${profile.fullName}`);

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    };

  } catch (error) {
    console.error('❌ Failed to send health alert email:', error.message);
    return {
      success: false,
      message: 'Failed to send email',
      error: error.message
    };
  }
};

/**
 * Check if email configuration is valid
 * @returns {boolean}
 */
export const isEmailConfigured = () => {
  return !!(SMTP_USER && SMTP_PASS);
};

export default {
  sendHealthAlertEmail,
  isEmailConfigured
};