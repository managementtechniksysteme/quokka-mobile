import Constants from 'expo-constants';
import { z } from 'zod';

export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || 'http://quokka.linkto.ms/api';

export const commonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const ErrorSchema = z.object({});

export const PaginationSchema = z.object({
  links: z.object({
    first: z.string(),
    last: z.string(),
    prev: z.string().nullable(),
    next: z.string().nullable(),
  }),
  meta: z.object({
    current_page: z.number(),
    from: z.number().nullable(),
    last_page: z.number(),
  }),
});

export const SelectOptionDataSchema = z.object({
  id: z.number().nullable(),
  text: z.string(),
});

export const SelectOptionsSchema = z.object({
  data: z.array(SelectOptionDataSchema),
});

export type SelectOption = z.infer<typeof SelectOptionDataSchema>;
