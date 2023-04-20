import {useAuth} from "../context/auth";
import {useQuery} from "react-query";
import {useApiClient} from "./config/client";
import {API_BASE_URL, SelectOptionsSchema} from "./config/config";

export const useGetEmployeeSelectOptions = () => {
  const auth = useAuth();

  return useQuery(
    ['employee', 'selectoptions'],
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/employees/select-options`,
        { schema: SelectOptionsSchema }
      );
    });
}