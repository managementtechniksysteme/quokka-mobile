import {z} from "zod";
import {useAuth} from "../context/auth";
import {useQuery} from "react-query";
import {useApiClient} from "./config/client";
import {API_BASE_URL} from "./config/config";

const ApplicationSettingsDataSchema = z.object({
  currency_unit: z.string(),
  accounting_min_amount: z.number(),
})

const ApplicationSettingsSchema = z.object({
  data: ApplicationSettingsDataSchema,
})

export type ApplicationSettings = z.infer<typeof ApplicationSettingsDataSchema>

export const useGetApplicationSettings = () => {
  const auth = useAuth();

  return useQuery(
    ['application-settings'],
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/application-settings`,
        { schema: ApplicationSettingsSchema }
      );
    });
}