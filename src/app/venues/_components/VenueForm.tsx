'use client';

import type { BaseSyntheticEvent } from 'react';
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

type Props = {
  initial?: Venue;
  onSubmit: SubmitHandler<VenueFormValues>;
  submitLabel?: string;
};

export default function VenueForm({
  initial,
  onSubmit,
  submitLabel = 'Save',
}: Props) {
  // ✅ gör resolvern explicit – annars gnäller TS
  const resolver = yupResolver(venueSchema) as Resolver<VenueFormValues>;

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<VenueFormValues>({
    resolver,
    defaultValues: createDefaultValues(initial),
  });

  // ✅ tydlig signatur för invalid
  const onInvalid: SubmitErrorHandler<VenueFormValues> = (errs) => {
    console.log('Form errors:', errs);
    if (errs.media?.[0]?.url) setFocus('media.0.url');
  };

  // ✅ tydlig signatur (values + ev)
  const submitProxy: SubmitHandler<VenueFormValues> = (
    values: VenueFormValues,
    ev?: BaseSyntheticEvent
  ) => {
    console.log('media before submit =', getValues('media'));
    return onSubmit(values, ev);
  };

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(submitProxy, onInvalid)}
      className="space-y-5"
    >
      {/* Name */}
      <div>
        <label className="label">Venue name</label>
        <input
          className="input"
          placeholder="Venue name"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="label">Description</label>
        <textarea
          rows={4}
          className="input min-h-[120px]"
          placeholder="Describe the venue, amenities, location…"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Gallery */}
      <GalleryFields
        control={control as Control<VenueFormValues>} // ✅ säker typ
        register={register}
        watch={watch}
        errors={errors}
      />

      {/* Price / Guests */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Price / night</label>
          <input
            type="number"
            className="input no-spinner"
            placeholder="100"
            autoComplete="off"
            {...register('price', { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-xs text-red-600">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="label">Max guests</label>
          <input
            type="number"
            className="input no-spinner"
            placeholder="1"
            autoComplete="off"
            {...register('maxGuests', { valueAsNumber: true })}
          />
          {errors.maxGuests && (
            <p className="text-xs text-red-600">{errors.maxGuests.message}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">City</label>
          <input className="input" placeholder="City" {...register('city')} />
        </div>
        <div>
          <label className="label">Country</label>
          <input
            className="input"
            placeholder="Country"
            {...register('country')}
          />
        </div>
      </div>

      {/* Meta */}
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

      {/* Submit */}
      <div className="flex justify-start">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
