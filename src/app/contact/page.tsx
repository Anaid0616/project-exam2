'use client';

import { useRouter } from 'next/navigation';
import ContactForm, { ContactFormValues } from './_components/ContactForm';
export default function ContactPage() {
  const router = useRouter();

  const handleSubmit = async (values: ContactFormValues) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values), // { name, email, subject, message }
      });
      if (!res.ok) throw new Error('Failed to send');

      alert('Thank you, we received your message.');
      return true;
    } catch (err) {
      console.error(err);
      alert("We couldn't receive your message. Please try again.");
      return false;
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <div className="card p-5">
        <h1 className="text-xl font-semibold my-4 text-center">Contact us</h1>
        <ContactForm onSubmit={handleSubmit} submitLabel="Send" />
      </div>
    </main>
  );
}
