export const emailConfimation = (userName, OTP) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Search App - OTP Confirmation</title>
  <style>
    /* Reset CSS */
    body, html {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
    }

    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
    }

    /* Header */
    .header {
      background-color: #0073b1;
      color: #ffffff;
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }

    /* Content */
    .content {
      padding: 20px;
      color: #333333;
    }

    .content h2 {
      font-size: 20px;
      margin-bottom: 10px;
      color: #0073b1;
    }

    .content p {
      font-size: 16px;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    /* OTP Box */
    .otp-box {
      background-color: #f4f4f4;
      padding: 15px;
      text-align: center;
      border: 1px solid #e0e0e0;
      margin: 20px 0;
    }

    .otp-box .otp {
      font-size: 28px;
      font-weight: bold;
      color: #0073b1;
      letter-spacing: 5px;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f4f4f4;
      color: #666666;
      font-size: 14px;
      border-top: 1px solid #e0e0e0;
    }

    .footer a {
      color: #0073b1;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>Job Search App</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Hi ${userName},</h2>
      <p>Thank you for signing up with Job Search App! To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>

      <!-- OTP Box -->
      <div class="otp-box">
        <span class="otp">${OTP}</span>
      </div>

      <p>This OTP is valid for the next 10 minutes. If you did not request this, please ignore this email.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>If you have any questions, feel free to <a href="mailto:support@jobsearchapp.com">contact our support team</a>.</p>
      <p>&copy; 2025 Job Search App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

export const passwordReset = (userName, OTP) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Search App - Reset Password</title>
  <style>
    /* Reset CSS */
    body, html {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
    }

    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
    }

    /* Header */
    .header {
      background-color: #0073b1;
      color: #ffffff;
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }

    /* Content */
    .content {
      padding: 20px;
      color: #333333;
    }

    .content h2 {
      font-size: 20px;
      margin-bottom: 10px;
      color: #0073b1;
    }

    .content p {
      font-size: 16px;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    /* OTP Box */
    .otp-box {
      background-color: #f4f4f4;
      padding: 15px;
      text-align: center;
      border: 1px solid #e0e0e0;
      margin: 20px 0;
    }

    .otp-box .otp {
      font-size: 28px;
      font-weight: bold;
      color: #0073b1;
      letter-spacing: 5px;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f4f4f4;
      color: #666666;
      font-size: 14px;
      border-top: 1px solid #e0e0e0;
    }

    .footer a {
      color: #0073b1;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>Job Search App</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Hi ${userName},</h2>
      <p>We received a request to reset your password for your Job Search App account. To proceed, please use the following One-Time Password (OTP) to verify your identity:</p>

      <!-- OTP Box -->
      <div class="otp-box">
        <span class="otp">${OTP}</span>
      </div>

      <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
      <p>Thank you for using Job Search App!</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>If you have any questions, feel free to <a href="mailto:support@jobsearchapp.com">contact our support team</a>.</p>
      <p>&copy; 2025 Job Search App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

export const forgetPassword = (userName, OTP) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Search App - Forget Password</title>
  <style>
    /* Reset CSS */
    body, html {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
    }

    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
    }

    /* Header */
    .header {
      background-color: #0073b1;
      color: #ffffff;
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }

    /* Content */
    .content {
      padding: 20px;
      color: #333333;
    }

    .content h2 {
      font-size: 20px;
      margin-bottom: 10px;
      color: #0073b1;
    }

    .content p {
      font-size: 16px;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    /* OTP Box */
    .otp-box {
      background-color: #f4f4f4;
      padding: 15px;
      text-align: center;
      border: 1px solid #e0e0e0;
      margin: 20px 0;
    }

    .otp-box .otp {
      font-size: 28px;
      font-weight: bold;
      color: #0073b1;
      letter-spacing: 5px;
    }

    /* Call to Action */
    .cta {
      text-align: center;
      margin: 20px 0;
    }

    .cta p {
      font-size: 16px;
      margin-bottom: 10px;
    }

    .cta .note {
      font-size: 14px;
      color: #666666;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f4f4f4;
      color: #666666;
      font-size: 14px;
      border-top: 1px solid #e0e0e0;
    }

    .footer a {
      color: #0073b1;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>Job Search App</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Hi ${userName},</h2>
      <p>We received a request to reset your password for your Job Search App account. To proceed, please use the following One-Time Password (OTP) to verify your identity:</p>

      <!-- OTP Box -->
      <div class="otp-box">
        <span class="otp">${OTP}</span>
      </div>

      <!-- Call to Action -->
      <div class="cta">
        <p>Enter this OTP on the verification page to reset your password.</p>
        <p class="note">This OTP is valid for the next 10 minutes. If you did not request this, please ignore this email or contact our support team immediately.</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>If you have any questions, feel free to <a href="mailto:support@jobsearchapp.com">contact our support team</a>.</p>
      <p>&copy; 2025 Job Search App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

export const passwordChanged = (userName, timestamp) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Search App - Password Changed</title>
  <style>
    /* Reset CSS */
    body, html {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
    }

    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    /* Header */
    .header {
      background-color: #0073b1;
      color: #ffffff;
      text-align: center;
      padding: 30px 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: bold;
    }

    /* Content */
    .content {
      padding: 30px 20px;
      color: #333333;
    }

    .content h2 {
      font-size: 22px;
      margin-bottom: 15px;
      color: #0073b1;
    }

    .content p {
      font-size: 16px;
      margin-bottom: 20px;
      line-height: 1.6;
      color: #555555;
    }

    /* Alert Box */
    .alert-box {
      background-color: #fff3cd;
      padding: 20px;
      border-left: 5px solid #ffc107;
      margin: 20px 0;
    }

    .alert-box p {
      margin: 0;
      font-size: 16px;
      color: #856404;
    }

    /* Timestamp */
    .timestamp {
      font-size: 14px;
      color: #666666;
      margin-bottom: 20px;
    }

    .timestamp strong {
      color: #0073b1;
    }

    /* Call to Action */
    .cta {
      text-align: center;
      margin: 20px 0;
    }

    .cta p {
      font-size: 16px;
      margin-bottom: 10px;
      color: #333333;
    }

    .cta .note {
      font-size: 14px;
      color: #666666;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f4f4f4;
      color: #666666;
      font-size: 14px;
      border-top: 1px solid #e0e0e0;
    }

    .footer a {
      color: #0073b1;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>Job Search App</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Hi ${userName},</h2>
      <p>This is a confirmation that the password for your Job Search App account has been successfully changed.</p>

      <!-- Timestamp -->
      <div class="timestamp">
        <p><strong>Change Time:</strong> ${timestamp}</p>
      </div>

      <!-- Alert Box -->
      <div class="alert-box">
        <p>If you did not make this change, please contact our support team immediately to secure your account.</p>
      </div>

      <!-- Call to Action -->
      <div class="cta">
        <p>If you have any questions or need further assistance, feel free to reach out to us.</p>
        <p class="note">This is an automated notification. Please do not reply to this email.</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>If you have any questions, feel free to <a href="mailto:support@jobsearchapp.com">contact our support team</a>.</p>
      <p>&copy; 2025 Job Search App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

export const acceptanceEmail = (userName, jobTitle, companyName, companyEmail) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Search App - Application Accepted</title>
  <style>
    /* Reset CSS */
    body, html {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
    }

    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    /* Header */
    .header {
      background-color: #0073b1;
      color: #ffffff;
      text-align: center;
      padding: 30px 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: bold;
    }

    /* Content */
    .content {
      padding: 30px 20px;
      color: #333333;
    }

    .content h2 {
      font-size: 22px;
      margin-bottom: 15px;
      color: #0073b1;
    }

    .content p {
      font-size: 16px;
      margin-bottom: 20px;
      line-height: 1.6;
      color: #555555;
    }

    /* Highlight Box */
    .highlight-box {
      background-color: #e9f5ff;
      padding: 20px;
      border-left: 5px solid #0073b1;
      margin: 20px 0;
    }

    .highlight-box p {
      margin: 0;
      font-size: 16px;
      color: #333333;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f4f4f4;
      color: #666666;
      font-size: 14px;
      border-top: 1px solid #e0e0e0;
    }

    .footer a {
      color: #0073b1;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>Job Search App</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Congratulations, ${userName}!</h2>
      <p>We are excited to inform you that your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been accepted!</p>

      <!-- Highlight Box -->
      <div class="highlight-box">
        <p>Next Steps:</p>
        <ul>
          <li>You will receive a formal offer letter shortly.</li>
          <li>If you have any questions, feel free to contact us at <a href="mailto:${companyEmail}">${companyEmail}</a>.</li>
        </ul>
      </div>

      <p>We are thrilled to have you join our team and look forward to working with you!</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>If you have any questions, feel free to <a href="mailto:support@jobsearchapp.com">contact our support team</a>.</p>
      <p>&copy; 2025 Job Search App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

export const rejectionEmail = (userName, jobTitle, companyName) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Search App - Application Status</title>
  <style>
    /* Reset CSS */
    body, html {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
    }

    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    /* Header */
    .header {
      background-color: #0073b1;
      color: #ffffff;
      text-align: center;
      padding: 30px 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: bold;
    }

    /* Content */
    .content {
      padding: 30px 20px;
      color: #333333;
    }

    .content h2 {
      font-size: 22px;
      margin-bottom: 15px;
      color: #0073b1;
    }

    .content p {
      font-size: 16px;
      margin-bottom: 20px;
      line-height: 1.6;
      color: #555555;
    }

    /* Highlight Box */
    .highlight-box {
      background-color: #f8f9fa;
      padding: 20px;
      border-left: 5px solid #666666;
      margin: 20px 0;
    }

    .highlight-box p {
      margin: 0;
      font-size: 16px;
      color: #333333;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f4f4f4;
      color: #666666;
      font-size: 14px;
      border-top: 1px solid #e0e0e0;
    }

    .footer a {
      color: #0073b1;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>Job Search App</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Dear ${userName},</h2>
      <p>Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>. After careful consideration, we regret to inform you that we have decided to move forward with other candidates.</p>

      <!-- Highlight Box -->
      <div class="highlight-box">
        <p>We truly appreciate the time and effort you invested in your application. Your skills and experience are impressive, and we encourage you to apply for future opportunities that match your profile.</p>
      </div>

      <p>We wish you the best in your job search and future endeavors.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>If you have any questions, feel free to <a href="mailto:support@jobsearchapp.com">contact our support team</a>.</p>
      <p>&copy; 2025 Job Search App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;