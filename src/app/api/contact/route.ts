import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required fields." },
        { status: 400 }
      );
    }

    // Configure nodemailer with Gmail service using environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Setup mail options
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "mdarafat3167@gmail.com",
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Subject: ${subject}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;">
          <h2 style="color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 12px; margin-top: 0;">New Contact Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0; width: 120px; color: #666666;">Name:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #f0f0f0; font-size: 15px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0; color: #666666;">Email:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #f0f0f0; font-size: 15px;"><a href="mailto:${email}" style="color: #4F46E5; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0; color: #666666;">Phone:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #f0f0f0; font-size: 15px;">${phone || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0; color: #666666;">Subject:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #f0f0f0; font-size: 15px; font-weight: 500;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 25px; padding: 20px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #4F46E5;">
            <h4 style="margin-top: 0; margin-bottom: 10px; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Message Details:</h4>
            <p style="white-space: pre-wrap; color: #4b5563; margin: 0; font-size: 15px; line-height: 1.7;">${message}</p>
          </div>
          <p style="margin-top: 25px; font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #f0f0f0; padding-top: 15px;">
            This email was sent from the portfolio contact form.
          </p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Nodemailer error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
