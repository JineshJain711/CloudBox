module.exports = ( name, otp, expiry = 5 ) => {
  return `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif;">
    
    <!-- Centered container for email -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto;">
        <tr>
            <td>
                <!-- Main card container -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    
                    <!-- Header with app logo -->
                    <tr>
                        <td align="center" style="padding: 32px 32px 20px 32px;">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); border-radius: 10px; padding: 12px;">
                                        <!-- Cloud upload icon using text/emoji for maximum compatibility -->
                                        <span style="color: white; font-size: 24px;">📁</span>
                                    </td>
                                </tr>
                            </table>
                            <h1 style="color: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: bold; margin: 16px 0 4px 0; padding: 0;">SecureUpload</h1>
                            <p style="color: #94a3b8; font-size: 14px; margin: 0; padding: 0;">Secure File Management</p>
                        </td>
                    </tr>
                    
                    <!-- Content area -->
                    <tr>
                        <td style="padding: 0 32px 32px 32px;">
                            
                            <!-- Greeting -->
                            <h2 style="color: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: bold; margin: 0 0 20px 0;">Hello, ${name}!</h2>
                            
                            <!-- Main message -->
                            <p style="color: #cbd5e1; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
                                To complete your file upload verification, please use the One-Time Password (OTP) below. This ensures secure access to your account.
                            </p>
                            
                            <!-- OTP Code Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
                                <tr>
                                    <td align="center">
                                        <table cellpadding="0" cellspacing="0" border="0" style="background: #111111; border-radius: 10px; border: 1px solid #333333; padding: 20px;">
                                            <tr>
                                                <td align="center">
                                                    <p style="color: #94a3b8; font-size: 14px; font-weight: bold; margin: 0 0 12px 0; letter-spacing: 1px;">VERIFICATION CODE</p>
                                                    <div style="font-size: 32px; font-weight: bold; color: #06b6d4; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace; padding: 12px 0; margin: 0;">
                                                        ${otp}
                                                    </div>
                                                    <p style="color: #64748b; font-size: 14px; margin: 12px 0 0 0;">
                                                        Valid for <strong style="color: #06b6d4;">${expiry} minutes</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security warning -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #2a1a1a; border-left: 4px solid #ef4444; border-radius: 0 4px 4px 0; margin: 24px 0;">
                                <tr>
                                    <td style="padding: 16px;">
                                        <p style="color: #f87171; font-size: 14px; line-height: 1.5; margin: 0;">
                                            <strong>⚠️ SECURITY NOTICE:</strong><br>
                                            Never share this OTP with anyone. Our team will never ask for your verification code. This code is for your use only.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Divider -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
                                <tr>
                                    <td style="border-top: 1px solid #333333;"></td>
                                </tr>
                            </table>
                            
                            <!-- Additional info -->
                            <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 8px 0;">
                                If you didn't request this verification code, please ignore this email or contact our support team immediately.
                            </p>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #111111; padding: 24px 32px; border-top: 1px solid #333333;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">
                                            © ${new Date().getFullYear()} SecureUpload. All rights reserved.<br>
                                            <span style="color: #94a3b8;">
                                                Need help? Contact 
                                                <a href="mailto:support@secureupload.com" style="color: #06b6d4; text-decoration: none;">support@secureupload.com</a>
                                            </span>
                                        </p>
                                        <p style="color: #475569; font-size: 11px; margin: 12px 0 0 0; padding: 0;">
                                            This is an automated message. Please do not reply to this email.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                </table>
                
                <!-- Bottom spacing for mobile -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                    <tr>
                        <td style="padding: 0; font-size: 12px; color: #666666; text-align: center;">
                            This email was sent by SecureUpload
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
  `;
};
