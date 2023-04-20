import {useApiClient} from "./config/client";
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "react-query";
import {API_BASE_URL, PaginationSchema, SelectOption} from "./config/config";
import {useAuth} from "../context/auth";
import {z} from "zod";
import {useEffect, useState} from "react";
import {apiDate} from "../utils/dateTime";


const AccountingDataSchema = z.object({
  id: z.number(),
  service_provided_on: z.string().transform((value) => new Date(value)),
  service_provided_started_at: z.string().nullable().transform((value) => value ? new Date(value) : null),
  service_provided_ended_at: z.string().nullable().transform((value) => value ? new Date(value) : null),
  amount: z.number(),
  comment: z.string().nullable(),
  created_at: z.string().transform((value) => new Date(value)),
  updated_at: z.string().transform((value) => new Date(value)),
  employee_id: z.number(),
  project_id: z.number(),
  service_id: z.number(),
})

const AccountingListDataSchema = AccountingDataSchema.extend({
  employee_name: z.string(),
  project_name: z.string(),
  service_name: z.string(),
  service_type: z.enum(['material', 'wage']),
  service_unit: z.string(),
})

const AccountingListSchema = z.object({
  data: z.array(AccountingListDataSchema),
}).merge(PaginationSchema)

const AccountingEntrySchema = z.object({
  data: AccountingDataSchema,
})

export type AccountingData = z.infer<typeof AccountingDataSchema>;
export type AccountingMutableData = Partial<AccountingData>;
export type AccountingEntry = z.infer<typeof AccountingDataSchema>
export type AccountingListEntry = z.infer<typeof AccountingListDataSchema>

export type AccountingFilters = {
  start?: Date,
  end?: Date,
  employee?: SelectOption,
  project?: SelectOption,
  service?: SelectOption,
  show_only_own: boolean,
};

export const useGetAccounting = (filters: AccountingFilters) => {
  const auth = useAuth();
  const queryClient = useQueryClient()
  const [queryString, setQueryString] = useState('');

  useEffect( () => {
    let params = {};

    if(filters.start) {
      params.start = apiDate(filters.start);
    }
    if(filters.end) {
      params.end = apiDate(filters.end);
    }
    if(filters.employee) {
      params.employee_id = filters.employee?.id;
    }
    if(filters.project) {
      params.project_id = filters.project?.id;
    }
    if(filters.vehicle) {
      params.service_id = filters.service?.id;
    }
    if(filters.show_only_own) {
      params.only_own = filters.show_only_own;
    }

    setQueryString(new URLSearchParams(params).toString());
  }, [filters.start, filters.end, filters.employee?.id, filters.project?.id, filters.service?.id, filters.show_only_own])

  return useInfiniteQuery(
    [
      'accounting', {filter: queryString}],
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/accounting?${queryString}`,
        {schema: AccountingListSchema}
      );
    }, {
      getNextPageParam: lastPage => {
        return lastPage.links.next;
      },
      keepPreviousData: true,
    });
}

export const useGetAccountingEntry = (id: number) => {
  const auth = useAuth();

  return useQuery(
    ['accounting', id],
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/accounting/${id}`,
        { schema: AccountingEntrySchema }
      );
    });
}

export const useCreateAccountingEntry = () => {
  const auth = useAuth();
  const queryClient = useQueryClient()

  return useMutation((data: AccountingMutableData) => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/accounting`,
        { options: { method: 'POST', body: JSON.stringify(data) } }
      )
    },{
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'accounting' })
        queryClient.invalidateQueries({ queryKey: 'dashboard' })
      }
    }
  )
}

export type UpdateAccountingEntryProps = {
  id: number,
  data: AccountingMutableData,
}

export const useUpdateAccountingEntry = () => {
  const auth = useAuth();
  const queryClient = useQueryClient()

  return useMutation(({id, data}: UpdateAccountingEntryProps) => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/accounting/${id}`,
        { options: { method: 'PATCH', body: JSON.stringify(data) } }
      )
    },{
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'accounting' })
        queryClient.invalidateQueries({ queryKey: 'dashboard' })
      }
    }
  )
}

export const useDestroyAccountingEntry = () => {
  const auth = useAuth();
  const queryClient = useQueryClient()

  return useMutation((id: number) => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/accounting/${id}`,
        { options: { method: 'DELETE' } }
      )
    },{
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'accounting' })
        queryClient.invalidateQueries({ queryKey: 'dashboard' })
      }
    }
  )
}
