import { NextResponse } from 'next/server';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

// Only in memory, will be lost on server restart
const MESSAGES: ContactMessage[] = [];

// Basic validation
function isNonEmpty(v: unknown, max = 2000) {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= max;
}

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (
      !isNonEmpty(name, 80) ||
      !isNonEmpty(email, 120) ||
      !isNonEmpty(subject, 120) ||
      !isNonEmpty(message, 2000)
    ) {
      return NextResponse.json(
        { ok: false, error: 'Invalid fields' },
        { status: 400 }
      );
    }

    const item: ContactMessage = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    MESSAGES.unshift(item);
    if (MESSAGES.length > 50) MESSAGES.pop();

    // For demo purposes, log to console. In real life, send email or store in DB.
    console.log('CONTACT MESSAGE:', item);

    return NextResponse.json({ ok: true, id: item.id }, { status: 201 });
  } catch (err) {
    console.error('CONTACT ERROR:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  // For demo purposes only, return messages.
  return NextResponse.json({ ok: true, messages: MESSAGES }, { status: 200 });
}
