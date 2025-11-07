'use client';

import { useEffect, useRef, useState } from 'react';
import {
  useForm,
  type SubmitHandler,
  type SubmitErrorHandler,
  type Resolver,
  type Control,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import type { Venue } from '@/types/venue';
import {
  venueSchema,
  type VenueFormValues,
} from '@/features/venues/forms/schema';
import { createDefaultValues } from '@/features/venues/forms/types';
import GalleryFields from '@/features/venues/forms/GalleryFields';
import { Controller } from 'react-hook-form';
import RatingPicker from '@/components/ui/RatingPicker';

type Props = {
  /** Optional initial venue to prefill the form (edit mode). */
  initial?: Venue;
  /** Submit handler. Uses the standard React Hook Form signature (void/Promise<void>). */
  onSubmit: SubmitHandler<VenueFormValues>;
  /** Text for the primary submit button. */
  submitLabel?: string;
};

/**
 * Accessible venue form:
 * - Proper label ↔ input association via htmlFor/id
 * - Field errors linked with aria-describedby + aria-invalid
 * - Local aria-live="polite" region near the submit button for async success/error
 * - Submit button reflects busy state via disabled + aria-busy
 */
export default function VenueForm({
  initial,
  onSubmit,
  submitLabel = 'Save',
}: Props) {
  const resolver = yupResolver(venueSchema) as Resolver<VenueFormValues>;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VenueFormValues>({
    resolver,
    defaultValues: createDefaultValues(initial),
  });

  // Prefill when initial changes (after fetch)
  useEffect(() => {
    if (initial) reset(createDefaultValues(initial));
  }, [initial, reset]);

  // Focus first error field on invalid
  const onInvalid: SubmitErrorHandler<VenueFormValues> = (errs) => {
    if (errs.media?.[0]?.url) setFocus('media.0.url');
  };

  // Local aria-live status message
  const [statusMsg, setStatusMsg] = useState('');
  const statusRef = useRef<HTMLParagraphElement>(null);

  const submitProxy: SubmitHandler<VenueFormValues> = async (values) => {
    setStatusMsg('Saving venue…');
    try {
      await onSubmit(values); // keep your original API
      setStatusMsg('Saved.');
    } catch {
      setStatusMsg('Save failed.');
    } finally {
      // Move focus so SR users hear the update immediately
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  };

  // Stable ids for label ↔ input association
  const id = {
    name: 'venue-name',
    description: 'venue-description',
    price: 'venue-price',
    maxGuests: 'venue-max-guests',
    city: 'venue-city',
    country: 'venue-country',
  };

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(submitProxy, onInvalid)}
      className="space-y-5"
    >
      {/* Name */}
      <div>
        <label className="label" htmlFor={id.name}>
          Venue name
        </label>
        <input
          id={id.name}
          className="input"
          placeholder="Venue name"
          {...register('name')}
          aria-invalid={!!errors.name || undefined}
          aria-describedby={errors.name ? `${id.name}-error` : undefined}
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

      {/* Description */}
      <div>
        <label className="label" htmlFor={id.description}>
          Description
        </label>
        <textarea
          id={id.description}
          rows={4}
          className="input min-h-[120px]"
          placeholder="Describe the venue, amenities, location…"
          {...register('description')}
          aria-invalid={!!errors.description || undefined}
          aria-describedby={
            errors.description ? `${id.description}-error` : undefined
          }
        />
        {errors.description && (
          <p
            id={`${id.description}-error`}
            className="text-xs text-red-600"
            role="status"
            aria-live="polite"
          >
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Rating with icon */}
      <div>
        <span className="label" id="venue-rating-label">
          Rating
        </span>
        <Controller
          name="rating"
          control={control}
          render={({ field: { value, onChange } }) => (
            <RatingPicker
              value={typeof value === 'number' ? value : null}
              onChange={onChange}
              iconSrc="/logofooter.svg"
              groupLabelId="venue-rating-label"
            />
          )}
        />
        {errors.rating && (
          <p className="text-xs text-red-600">{errors.rating.message}</p>
        )}
      </div>

      {/* Gallery */}
      <GalleryFields
        control={control as Control<VenueFormValues>}
        register={register}
        watch={watch}
        errors={errors}
      />

      {/* Price / Guests */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor={id.price}>
            Price / night
          </label>
          <input
            id={id.price}
            type="number"
            className="input no-spinner"
            placeholder="100"
            autoComplete="off"
            {...register('price', { valueAsNumber: true })}
            aria-invalid={!!errors.price || undefined}
            aria-describedby={errors.price ? `${id.price}-error` : undefined}
            inputMode="decimal"
          />
          {errors.price && (
            <p
              id={`${id.price}-error`}
              className="text-xs text-red-600"
              role="status"
              aria-live="polite"
            >
              {errors.price.message}
            </p>
          )}
        </div>
        <div>
          <label className="label" htmlFor={id.maxGuests}>
            Max guests
          </label>
          <input
            id={id.maxGuests}
            type="number"
            className="input no-spinner"
            placeholder="1"
            autoComplete="off"
            {...register('maxGuests', { valueAsNumber: true })}
            aria-invalid={!!errors.maxGuests || undefined}
            aria-describedby={
              errors.maxGuests ? `${id.maxGuests}-error` : undefined
            }
            inputMode="numeric"
          />
          {errors.maxGuests && (
            <p
              id={`${id.maxGuests}-error`}
              className="text-xs text-red-600"
              role="status"
              aria-live="polite"
            >
              {errors.maxGuests.message}
            </p>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor={id.city}>
            City
          </label>
          <input
            id={id.city}
            className="input"
            placeholder="City"
            {...register('city')}
            aria-invalid={!!errors.city || undefined}
            aria-describedby={errors.city ? `${id.city}-error` : undefined}
          />
          {errors.city && (
            <p
              id={`${id.city}-error`}
              className="text-xs text-red-600"
              role="status"
              aria-live="polite"
            >
              {errors.city.message}
            </p>
          )}
        </div>
        <div>
          <label className="label" htmlFor={id.country}>
            Country
          </label>
          <input
            id={id.country}
            className="input"
            placeholder="Country"
            {...register('country')}
            aria-invalid={!!errors.country || undefined}
            aria-describedby={
              errors.country ? `${id.country}-error` : undefined
            }
          />
          {errors.country && (
            <p
              id={`${id.country}-error`}
              className="text-xs text-red-600"
              role="status"
              aria-live="polite"
            >
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      {/* Meta (labels wrap inputs = implicit association OK) */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('wifi')} /> Wifi
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('parking')} /> Parking
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('breakfast')} /> Breakfast
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('pets')} /> Pets
        </label>
      </div>

      {/* Submit + local live region */}
      <div className="flex flex-col items-start gap-2">
        <button
          type="submit"
          className="btn btn-primary mb-4"
          disabled={isSubmitting}
          aria-busy={isSubmitting || undefined}
          aria-live="off"
          aria-label={isSubmitting ? 'Saving venue…' : submitLabel}
        >
          {isSubmitting ? 'Saving…' : submitLabel}
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
