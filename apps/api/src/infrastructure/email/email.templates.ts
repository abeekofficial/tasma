export function baseLayout(content: string, previewText: string = ''): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${previewText}</title>
  <style>
    body { font-family: -apple-system, sans-serif; background-color: #111; color: #eee; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #fff; }
    .content { background-color: #222; padding: 20px; border-radius: 8px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #888; }
    .btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">TASMA</div>
    <div class="content">${content}</div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Tasma AI Video Studio. All rights reserved.</p>
      <p><a href="{{unsubscribe_url}}" style="color: #888;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;
}

export function verificationTemplate(name: string, verifyUrl: string) {
  const content = `<p>Hi ${name},</p><p>Please verify your email address by clicking the button below:</p><p><a href="${verifyUrl}" class="btn">Verify Email</a></p>`;
  return {
    subject: 'Verify your Tasma account',
    html: baseLayout(content, 'Verify your email'),
    text: `Hi ${name},\n\nPlease verify your email by opening this link: ${verifyUrl}`,
  };
}

export function passwordResetTemplate(name: string, resetUrl: string) {
  const content = `<p>Hi ${name},</p><p>Click below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}" class="btn">Reset Password</a></p>`;
  return {
    subject: 'Reset your Tasma password',
    html: baseLayout(content, 'Reset password'),
    text: `Hi ${name},\n\nReset your password here: ${resetUrl}`,
  };
}

export function magicLinkTemplate(loginUrl: string) {
  const content = `<p>Click below to log in. This link expires in 15 minutes.</p><p><a href="${loginUrl}" class="btn">Log In</a></p>`;
  return {
    subject: 'Your Tasma login link',
    html: baseLayout(content, 'Magic Link Login'),
    text: `Log in here: ${loginUrl}`,
  };
}

export function orgInviteTemplate(inviterName: string, orgName: string, role: string, acceptUrl: string) {
  const content = `<p>${inviterName} has invited you to join ${orgName} as a ${role}.</p><p><a href="${acceptUrl}" class="btn">Accept Invitation</a></p>`;
  return {
    subject: `You've been invited to join ${orgName} on Tasma`,
    html: baseLayout(content, 'Organization Invitation'),
    text: `${inviterName} invited you to ${orgName}. Accept here: ${acceptUrl}`,
  };
}

export function welcomeTemplate(name: string) {
  const content = `<p>Welcome to Tasma, ${name}!</p><p>We are excited to help you create amazing videos using AI.</p>`;
  return {
    subject: 'Welcome to Tasma!',
    html: baseLayout(content, 'Welcome to Tasma'),
    text: `Welcome to Tasma, ${name}!`,
  };
}

export function renderCompleteTemplate(projectName: string, downloadUrl: string) {
  const content = `<p>Your video "${projectName}" is ready to download.</p><p><a href="${downloadUrl}" class="btn">Download Video</a></p>`;
  return {
    subject: `Your video "${projectName}" is ready!`,
    html: baseLayout(content, 'Render Complete'),
    text: `Your video "${projectName}" is ready. Download here: ${downloadUrl}`,
  };
}
