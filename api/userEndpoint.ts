import {z} from "zod";
import {useAuth} from "../context/auth";
import {QueryClient, useQuery} from "react-query";
import {useApiClient} from "./config/client";
import {API_BASE_URL, commonHeaders} from "./config/config";

const UserSettingsSchema = z.object({
  'accounting_filter_default_days': z.number().nullable()
})

const UserDataSchema = z.object({
  id: z.number(),
  username: z.string(),
  username_avatar_string: z.string(),
  avatar_colour: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  permissions: z.array(z.string()).nullable(),
  settings: UserSettingsSchema,
  created_at: z.string().transform((value) => new Date(value)),
  updated_at: z.string().transform((value) => new Date(value)),
})

export const UserSchema = z.object({
  data: UserDataSchema,
})

export type User = z.infer<typeof UserDataSchema>
export type UserSchema = z.infer<typeof UserSchema>

export const useGetUser = () => {
  const auth = useAuth();

  return useQuery(
    'user',
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/user`,
        { schema: UserSchema }
      );
    });
}

const fetchUser = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    headers: {
      ...commonHeaders,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching user data.');
  }

  const data = UserSchema.parse(await response.json());

  return data.data;
}

export const prefetchUser = (queryClient: QueryClient, token: string) => {
  return queryClient.fetchQuery('user', {queryFn: () => {return fetchUser(token)}})
}