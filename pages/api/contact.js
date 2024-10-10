// pages/api/contact.js
import nodemailer from 'nodemailer';
import * as yup from 'yup';
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, message } = req.body;

        // Create a nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER, // your email
                pass: process.env.EMAIL_PASS, // your email password or app password
            },
        });

        const mailOptions = {
            from: email, // sender's email
            to: 'endofday1122@gmail.com', // your email
            subject: `Contact Form Submission from ${name}`,
            text: message,
            html: `<p>You have a new contact request from <strong>${name}</strong> (${email}):</p><p>${message}</p>`,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Message sent successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to send message', error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
