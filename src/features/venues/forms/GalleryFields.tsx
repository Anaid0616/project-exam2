'use client';

import Image from 'next/image';
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormWatch,
} from 'react-hook-form';
import type { VenueFormValues } from '@/features/venues/forms/schema';

// överst i filen
const isValidUrl = (s: string) => {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
};

export default function GalleryFields({
  control,
  register,
  watch,
  errors,
}: {
  control: Control<VenueFormValues>;
  register: UseFormRegister<VenueFormValues>;
  watch: UseFormWatch<VenueFormValues>;
  errors: FieldErrors<VenueFormValues>;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: 'media' });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="label m-0">Gallery</label>
        <button
          type="button"
          className="btn btn-white px-3 py-1.5"
          onClick={() => append({ url: '', alt: '' })}
        >
          + Add image
        </button>
      </div>

      {fields.map((f, i) => {
        const url = (watch(`media.${i}.url`) || '').trim();
        const isValid = isValidUrl(url);

        return (
          <div
            key={f.id}
            className="grid gap-3 items-start rounded-app border border-ink/10 p-3
    grid-cols-1 
    min-[500px]:grid-cols-[8rem,1fr,auto]"
          >
            <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-ink/5">
              {isValid ? (
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-ink/40">
                  Preview
                </div>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="text"
                className="input h-11 font-mono"
                placeholder="Image URL"
                {...register(`media.${i}.url` as const, {
                  setValueAs: (v) => String(v ?? '').trim(),
                })}
              />

              <input
                className="input h-11"
                placeholder="Alt text"
                {...register(`media.${i}.alt` as const)}
              />
            </div>

            {i > 0 ? (
              <button
                type="button"
                className="btn btn-outline-sunset px-3 py-1.5 whitespace-nowrap"
                onClick={() => remove(i)}
              >
                <span aria-hidden className="mr-1">
                  −
                </span>{' '}
                Remove
              </button>
            ) : (
              <span className="text-xs text-ink/40 px-1 py-1.5" />
            )}
          </div>
        );
      })}

      {typeof errors.media?.message === 'string' && (
        <p className="text-xs text-red-600">{errors.media.message}</p>
      )}
    </div>
  );
}
