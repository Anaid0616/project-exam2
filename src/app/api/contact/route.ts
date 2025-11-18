import { NextResponse } from 'next/server';

/**
 * A contact message submitted through the API.
 * @typedef {Object} ContactMessage
 * @property {string} id - Unique message identifier.
 * @property {string} name - Name of the sender.
 * @property {string} email - Email address of the sender.
 * @property {string} subject - Subject of the message.
 * @property {string} message - Body content of the message.
 * @property {string} createdAt - ISO timestamp when the message was created.
 */
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

/**
 * Performs basic string validation.
 *
 * @param {unknown} v - The value to validate.
 * @param {number} [max=2000] - Maximum allowed length of the string.
 * @returns {boolean} True if the value is a non-empty string within limits.
 */
function isNonEmpty(v: unknown, max = 2000) {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= max;
}

/**
 * Handles POST requests to create a new contact message.
 *
 * Expects a JSON body containing:
 * - `name` (string)
 * - `email` (string)
 * - `subject` (string)
 * - `message` (string)
 *
 * Performs input validation, stores the message in-memory, and returns a JSON response.
 *
 * @param {Request} req - The incoming HTTP request.
 * @returns {Promise<Response>} A JSON response indicating success or failure.
 */
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

/**
 * Handles GET requests by returning the list of stored messages.
 *
 * ⚠ For demo purposes only — do not expose messages publicly in production.
 *
 * @returns {Promise<Response>} A JSON response containing all stored contact messages.
 */
export async function GET() {
  return NextResponse.json({ ok: true, messages: MESSAGES }, { status: 200 });
}
