import * as yup from 'yup';
import type { VenueFormValues } from './types';
import { toNum, emptyStrToUndef } from './transforms';

export const venueSchema: yup.ObjectSchema<VenueFormValues> = yup
  .object({
    name: yup.string().required('Required'),
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
    description: yup.string().max(2000).optional(),
    tags: yup.string().optional(),
    media: yup
      .array()
      .of(
        yup.object({
          url: yup
            .string()
            .transform(emptyStrToUndef)
            .url('Invalid URL')
            .optional(),
          alt: yup.string().transform(emptyStrToUndef).max(80).optional(),
        })
      )
      .min(1)
      .required(),
    city: yup.string().optional(),
    country: yup.string().optional(),
    wifi: yup.boolean().optional(),
    parking: yup.boolean().optional(),
    breakfast: yup.boolean().optional(),
    pets: yup.boolean().optional(),
  })
  .required();
