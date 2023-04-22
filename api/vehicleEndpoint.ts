import {useAuth} from "../context/auth";
import {useQuery} from "react-query";
import {useApiClient} from "./config/client";
import {API_BASE_URL, SelectOptionsSchema} from "./config/config";
import {z} from "zod";

const VehicleKilometresDataSchema = z.object({
  id: z.number(),
  kilometres: z.number().nullable(),
})

const VehiclesKilometresListSchema = z.object({
  data: z.array(VehicleKilometresDataSchema),
});

export type VehicleKilometres = z.infer<typeof VehicleKilometresDataSchema>;

export const useGetVehicleKilometres = () => {
  const auth = useAuth();

  return useQuery(
    ['vehicle', 'kilometres'],
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/vehicles/current-kilometres`,
        { schema: VehiclesKilometresListSchema }
      );
    });
}

export const useGetVehicleSelectOptions = () => {
  const auth = useAuth();

  return useQuery(
    ['vehicle', 'selectoptions'],
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/vehicles/select-options`,
        { schema: SelectOptionsSchema }
      );
    });
}

