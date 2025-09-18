import * as yup from 'yup';

const urlField = yup
  .string()
  .trim()
  .test('optional-or-url', 'Must be a valid URL starting with http(s)', (v) => {
    if (!v) return true;
    try {
      new URL(v!);
      return true;
    } catch {
      return false;
    }
  });

const mediaItem = yup.object({
  url: urlField.optional(),
  alt: yup.string().trim().max(80, 'Alt must be ≤ 80 chars').optional(),
});

export const venueSchema = yup
  .object({
    name: yup.string().trim().required('Required'),
    description: yup.string().trim().required('Required').max(2000),
    media: yup
      .array()
      .of(mediaItem)
      .min(1, 'Add at least one image')
      .test(
        'at-least-one-url',
        'Add at least one image URL',
        (arr) =>
          Array.isArray(arr) &&
          arr.some((m) => (m?.url ?? '').trim().length > 0)
      )
      .required(),
    price: yup.number().typeError('Number').min(1).required('Required'),
    maxGuests: yup.number().typeError('Number').min(1).required('Required'),
    city: yup.string().trim().optional(),
    country: yup.string().trim().optional(),
    wifi: yup.boolean().optional(),
    parking: yup.boolean().optional(),
    breakfast: yup.boolean().optional(),
    pets: yup.boolean().optional(),
  })
  .required();

export type VenueFormValues = yup.InferType<typeof venueSchema>;
