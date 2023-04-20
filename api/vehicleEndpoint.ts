import {useAuth} from "../context/auth";
import {useQuery} from "react-query";
import {useApiClient} from "./config/client";
import {API_BASE_URL, SelectOptionsSchema} from "./config/config";

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