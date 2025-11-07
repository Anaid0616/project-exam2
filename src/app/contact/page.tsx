'use client';

import ContactForm, {
  ContactFormValues,
} from '@/features/contact/components/ContactForm';

/**
 * Contact page that submits the form to /api/contact
 * and returns a human-readable status message to the form.
 */
export default function ContactPage() {
  const handleSubmit = async (values: ContactFormValues) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values), // { name, email, subject, message }
      });
      if (!res.ok) throw new Error('Failed to send');

      // Let the form show & announce this message via aria-live
      return { ok: true, message: 'Thank you, we received your message.' };
    } catch (err) {
      console.error(err);
      return {
        ok: false,
        message: "We couldn't receive your message. Please try again.",
      };
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-2 sm:p-6 space-y-4">
      <div className="card p-5">
        <h1 className="text-xl font-semibold my-4 text-center">Contact us</h1>
        <ContactForm onSubmit={handleSubmit} submitLabel="Send" />
      </div>
    </main>
  );
}
