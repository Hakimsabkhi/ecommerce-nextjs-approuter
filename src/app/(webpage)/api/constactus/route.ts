import { contactFormTemplate } from '@/lib/sendconctusts';

import { NextRequest, NextResponse } from 'next/server';


const nodemailer = require('nodemailer');

export async function POST(req: NextRequest) {
  try {

    
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: 'No data' }, { status: 400 });
    }

    const {name ,email, message} = body;
    if (!name || !email ||!message ){
        return NextResponse.json({error:'data name and data email and data message null'},{status:401})
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', // or another email service provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    const mailOptions1 = {
      from: process.env.EMAIL_FROM,
      to: process.env.Email_Contact,
      subject: `${name} contact you`,
      html: contactFormTemplate(
       name,
       email,
       message
      ),
    };
    const mailOptions2 = {
        from: process.env.EMAIL_FROM,
        to:email,
        subject: 'Contact is successfully ',
        html:  `Hello, Thank you for email`,
      };
    await transporter.sendMail(mailOptions1); 
    await transporter.sendMail(mailOptions2); 
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Error sending email', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
