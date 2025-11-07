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

/**
 * Reusable image gallery fields for the venue form.
 * Provides accessible labels (htmlFor/id), error linking via aria-describedby,
 * and a decorative preview (screen-reader silent).
 */
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
        {/* Section title — not a form label */}
        <span className="label m-0" id="gallery-label">
          Gallery
        </span>
        <button
          type="button"
          className="btn btn-white px-3 py-1.5"
          onClick={() => append({ url: '', alt: '' })}
          aria-label="Add image"
        >
          + Add image
        </button>
      </div>

      {fields.map((f, i) => {
        const url = (watch(`media.${i}.url`) || '').trim();
        const valid = isValidUrl(url);

        // stable ids for inputs + error text
        const ids = {
          url: `media-${i}-url`,
          urlErr: `media-${i}-url-error`,
          alt: `media-${i}-alt`,
          altErr: `media-${i}-alt-error`,
        };

        const urlError = errors.media?.[i]?.url;
        const altError = errors.media?.[i]?.alt;

        return (
          <div
            key={f.id}
            className="grid gap-3 items-start rounded-app border border-ink/10 p-3
              grid-cols-1 min-[500px]:grid-cols-[8rem,1fr,auto]"
            aria-labelledby="gallery-label"
          >
            {/* Decorative preview: hidden from SR */}
            <div
              className="relative w-32 h-24 rounded-xl overflow-hidden bg-ink/5"
              aria-hidden="true"
            >
              {valid ? (
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

            {/* Inputs */}
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label htmlFor={ids.url} className="label">
                  Image URL
                </label>
                <input
                  id={ids.url}
                  type="text"
                  className="input h-11 font-mono"
                  placeholder="Image URL"
                  {...register(`media.${i}.url` as const, {
                    setValueAs: (v) => String(v ?? '').trim(),
                  })}
                  aria-invalid={!!urlError || undefined}
                  aria-describedby={urlError ? ids.urlErr : undefined}
                  inputMode="url"
                  autoComplete="off"
                />
                {urlError && (
                  <p
                    id={ids.urlErr}
                    className="text-xs text-red-600"
                    role="status"
                    aria-live="polite"
                  >
                    {String(urlError.message ?? 'Invalid URL')}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={ids.alt} className="label">
                  Alt text
                </label>
                <input
                  id={ids.alt}
                  className="input h-11"
                  placeholder="Alt text"
                  {...register(`media.${i}.alt` as const)}
                  aria-invalid={!!altError || undefined}
                  aria-describedby={altError ? ids.altErr : undefined}
                />
                {altError && (
                  <p
                    id={ids.altErr}
                    className="text-xs text-red-600"
                    role="status"
                    aria-live="polite"
                  >
                    {String(altError.message ?? 'Alt text is required')}
                  </p>
                )}
              </div>
            </div>

            {/* Remove */}
            {i > 0 ? (
              <button
                type="button"
                className="btn btn-outline-sunset px-3 py-1.5 whitespace-nowrap"
                onClick={() => remove(i)}
                aria-label={`Remove image ${i + 1}`}
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
