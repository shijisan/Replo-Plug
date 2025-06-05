import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { senderEmail, senderSubject, senderMessage } = await req.json();

        if (!senderEmail || !senderSubject || !senderMessage) {
            return new Response(JSON.stringify({ error: "All fields are required!" }), { status: 400 });
        }

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail", // You can use another SMTP service
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // App password (not your real password)
            },
        });

        const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: process.env.EMAIL_USER,   
        subject: `Replo Plug: ${senderSubject}`, 
        text: `
        You received a new message from your contact form:

        Sender Email: ${senderEmail}
        Subject: ${senderSubject}

        Message:
        ${senderMessage}
        `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ success: "Email sent successfully!" }), { status: 200 });

    } catch (error) {
        console.error("Email sending error:", error);
        return new Response(JSON.stringify({ error: "Failed to send email!" }), { status: 500 });
    }
}