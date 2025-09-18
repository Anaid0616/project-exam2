// src/features/venues/forms/schema.ts
import * as yup from 'yup';
import type { VenueFormValues } from './types';
import { toNum, emptyStrToUndef } from './transforms';

const mediaItem = yup.object({
  url: yup
    .string()
    .transform(emptyStrToUndef)
    .trim()

    .optional(),
  alt: yup.string().transform(emptyStrToUndef).trim().max(80).optional(),
});

export const venueSchema: yup.ObjectSchema<VenueFormValues> = yup
  .object({
    name: yup.string().trim().required('Required'),
    price: yup
      .number()
      .transform(toNum)
      .typeError('Number')
      .min(1)
      .required('Required'),
    maxGuests: yup
      .number()
      .transform(toNum)
      .typeError('Number')
      .min(1)
      .required('Required'),

    // Optional fields
    description: yup
      .string()
      .transform(emptyStrToUndef)
      .trim()
      .max(2000)
      .optional(),

    tags: yup.string().transform(emptyStrToUndef).trim().optional(),

    media: yup
      .array()
      .of(mediaItem)
      .min(1, 'Add at least one image')
      // Custom test: at least one item must have a URL
      .test('at-least-one-url', 'Add at least one image URL', (arr) =>
        Array.isArray(arr) ? arr.some((m) => !!m?.url) : false
      )
      .required(),

    city: yup.string().transform(emptyStrToUndef).trim().optional(),
    country: yup.string().transform(emptyStrToUndef).trim().optional(),
    wifi: yup.boolean().optional(),
    parking: yup.boolean().optional(),
    breakfast: yup.boolean().optional(),
    pets: yup.boolean().optional(),
  })
  .required();
