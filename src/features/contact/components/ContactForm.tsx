'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useRef, useState } from 'react';

export type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const schema = yup
  .object({
    name: yup.string().trim().required('Name is required').max(80),
    email: yup
      .string()
      .trim()
      .email('Invalid email')
      .required('Email is required'),
    subject: yup.string().trim().required('Subject is required').max(120),
    message: yup.string().trim().required('Message is required').max(2000),
  })
  .required();

type Props = {
  /**
   * Submit handler. Return shape:
   *   { ok: true, message: string } on success
   *   { ok: false, message: string } on failure
   */
  onSubmit: (
    values: ContactFormValues
  ) =>
    | Promise<{ ok: boolean; message: string }>
    | { ok: boolean; message: string };
  submitLabel?: string;
  defaultValues?: Partial<ContactFormValues>;
};

/**
 * Accessible contact form with:
 * - Proper label ↔ input association via htmlFor/id
 * - Field-level errors announced via aria-describedby
 * - Submit status announced via a local aria-live="polite" region
 * - Button reflects busy state via disabled + aria-busy
 */
export default function ContactForm({
  onSubmit,
  submitLabel = 'Send',
  defaultValues,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      ...defaultValues,
    },
  });

  // Prevent double-submit while awaiting
  const busyRef = useRef(false);

  // Local status message for aria-live (success/error)
  const [statusMsg, setStatusMsg] = useState<string>('');
  const statusRef = useRef<HTMLParagraphElement>(null);

  const submit: SubmitHandler<ContactFormValues> = async (values) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setStatusMsg('Sending message…');

    try {
      const res = await onSubmit(values);
      setStatusMsg(res.message);

      if (res.ok) {
        reset();
      }

      // Move focus to the status so SR users hear it immediately
      requestAnimationFrame(() => statusRef.current?.focus());
    } finally {
      busyRef.current = false;
    }
  };

  // Convenient ids for proper label association
  const id = {
    name: 'contact-name',
    email: 'contact-email',
    subject: 'contact-subject',
    message: 'contact-message',
  };

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(submit)}
      className="space-y-5"
    >
      <div>
        <label className="label" htmlFor={id.name}>
          Name
        </label>
        <input
          id={id.name}
          className="input"
          placeholder="Name"
          {...register('name')}
          aria-invalid={!!errors.name || undefined}
          aria-describedby={errors.name ? `${id.name}-error` : undefined}
          autoComplete="name"
        />
        {errors.name && (
          <p
            id={`${id.name}-error`}
            className="text-xs text-red-600"
            role="status"
            aria-live="polite"
          >
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="label" htmlFor={id.email}>
          Email
        </label>
        <input
          id={id.email}
          className="input"
          placeholder="Email"
          type="email"
          {...register('email')}
          aria-invalid={!!errors.email || undefined}
          aria-describedby={errors.email ? `${id.email}-error` : undefined}
          autoComplete="email"
        />
        {errors.email && (
          <p
            id={`${id.email}-error`}
            className="text-xs text-red-600"
            role="status"
            aria-live="polite"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="label" htmlFor={id.subject}>
          Subject
        </label>
        <input
          id={id.subject}
          className="input"
          placeholder="Subject"
          {...register('subject')}
          aria-invalid={!!errors.subject || undefined}
          aria-describedby={errors.subject ? `${id.subject}-error` : undefined}
          autoComplete="off"
        />
        {errors.subject && (
          <p
            id={`${id.subject}-error`}
            className="text-xs text-red-600"
            role="status"
            aria-live="polite"
          >
            {errors.subject.message}
          </p>
        )}
      </div>

      <div>
        <label className="label" htmlFor={id.message}>
          Message
        </label>
        <textarea
          id={id.message}
          rows={4}
          className="input min-h-[120px]"
          placeholder="Your message here..."
          {...register('message')}
          aria-invalid={!!errors.message || undefined}
          aria-describedby={errors.message ? `${id.message}-error` : undefined}
        />
        {errors.message && (
          <p
            id={`${id.message}-error`}
            className="text-xs text-red-600"
            role="status"
            aria-live="polite"
          >
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit + local live region */}
      <div className="flex flex-col items-start gap-2">
        <button
          type="submit"
          className="btn btn-primary px-6"
          disabled={isSubmitting || busyRef.current}
          aria-busy={isSubmitting || busyRef.current || undefined}
          aria-live="off"
          aria-label={isSubmitting ? 'Sending message…' : submitLabel}
        >
          {isSubmitting ? 'Sending…' : submitLabel}
        </button>

        {/* Visible status for sighted users; focusable + aria-live for SR */}
        <p
          ref={statusRef}
          tabIndex={-1}
          aria-live="polite"
          role="status"
          className="text-sm"
        >
          {statusMsg}
        </p>
      </div>
    </form>
  );
}
