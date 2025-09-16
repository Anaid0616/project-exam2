'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useRef } from 'react';

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
  onSubmit: (values: ContactFormValues) => Promise<boolean> | boolean;
  submitLabel?: string;
  defaultValues?: Partial<ContactFormValues>;
};

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

  //  Guard: block double-submit while awaiting
  const busyRef = useRef(false);

  const submit: SubmitHandler<ContactFormValues> = async (values) => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const ok = await onSubmit(values);
      if (ok) reset();
    } finally {
      busyRef.current = false;
    }
  };

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(submit)}
      className="space-y-5"
    >
      <div>
        <label className="label">Name</label>
        <input className="input" placeholder="Name" {...register('name')} />
        {errors.name && (
          <p className="text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="label">Email</label>
        <input
          className="input"
          placeholder="Email"
          type="email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="label">Subject</label>
        <input
          className="input"
          placeholder="Subject"
          {...register('subject')}
        />
        {errors.subject && (
          <p className="text-xs text-red-600">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label className="label">Message</label>
        <textarea
          rows={4}
          className="input min-h-[120px]"
          placeholder="Your message here..."
          {...register('message')}
        />
        {errors.message && (
          <p className="text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      <div className="flex justify-start">
        <button className="btn btn-primary" disabled={isSubmitting}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
