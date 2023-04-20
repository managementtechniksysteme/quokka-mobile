import {z} from "zod";
import {useAuth} from "../context/auth";
import {useQuery} from "react-query";
import {useApiClient} from "./config/client";
import {API_BASE_URL, SelectOptionsSchema} from "./config/config";

const HourlyBasedServiceIdsDataSchema = z.object({
  ids: z.number().array()
})

const HourlyBasedServiceIdsSchema = z.object({
  data: HourlyBasedServiceIdsDataSchema,
})

const ServiceTypesDataSchema = z.object({
  id: z.number(),
  type: z.enum(['material', 'wage']),
})

const ServiceTypesListSchema = z.object({
  data: z.array(ServiceTypesDataSchema),
});

export type HourlyBasedServiceIds = z.infer<typeof HourlyBasedServiceIdsDataSchema>;
export type ServiceType = z.infer<typeof ServiceTypesDataSchema>;

export const useGetHourlyBasedServiceIds = () => {
  const auth = useAuth();

  return useQuery(
    ['service', 'hourly-based-ids'],
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/services/hourly-based-ids`,
        { schema: HourlyBasedServiceIdsSchema }
      );
    });
}

export const useGetServiceTypes = () => {
  const auth = useAuth();

  return useQuery(
    ['service', 'types'],
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/services/types`,
        { schema: ServiceTypesListSchema }
      );
    });
}

export const useGetServiceSelectOptions = () => {
  const auth = useAuth();

  return useQuery(
    ['service', 'selectoptions'],
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/services/select-options`,
        { schema: SelectOptionsSchema }
      );
    });
}