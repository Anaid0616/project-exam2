'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { Venue } from '@/types/venue';

// Make sure this file exists at src/features/venues/forms/schema.ts
import { venueSchema } from '@/features/venues/forms/schema';
import {
  createDefaultValues,
  type VenueFormValues,
} from '@/features/venues/forms/types';
import GalleryFields from '@/features/venues/forms/GalleryFields';

export default function VenueForm({
  initial,
  onSubmit,
  submitLabel = 'Save',
}: {
  initial?: Venue;
  onSubmit: SubmitHandler<VenueFormValues>;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VenueFormValues>({
    resolver: yupResolver(venueSchema),
    defaultValues: createDefaultValues(initial),
  });

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
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

      <GalleryFields
        control={control}
        register={register}
        watch={watch}
        errors={errors}
      />

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

      <div>
        <label className="label">Tags</label>
        <input
          className="input"
          placeholder="e.g. beach, pool, family"
          {...register('tags')}
        />
        <p className="mt-1 text-xs text-ink/60">
          Separate with commas (beach, pool, family)
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('wifi')} />
          Wifi
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('parking')} />
          Parking
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('breakfast')} />
          Breakfast
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('pets')} />
          Pets
        </label>
      </div>

      <div className="flex justify-start">
        <button className="btn btn-primary" disabled={isSubmitting}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
