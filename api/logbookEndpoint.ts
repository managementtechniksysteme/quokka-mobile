import {useAuth} from "../context/auth";
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "react-query";
import {useApiClient} from "./config/client";
import {API_BASE_URL, PaginationSchema, SelectOption, SelectOptionsSchema} from "./config/config";
import {z} from "zod";
import {useEffect, useState} from "react";
import {apiDate} from "../utils/dateTime";

const LogbookDataSchema = z.object({
  id: z.number(),
  driven_on: z.string().transform((value) => new Date(value)),
  start_kilometres: z.number(),
  end_kilometres: z.number(),
  driven_kilometres: z.number(),
  litres_refuelled: z.number().nullable(),
  origin: z.string(),
  destination: z.string(),
  comment: z.string().nullable(),
  created_at: z.string().transform((value) => new Date(value)),
  updated_at: z.string().transform((value) => new Date(value)),
  employee_id: z.number(),
  project_id: z.number().nullable(),
  vehicle_id: z.number(),
})

const LogbookListDataSchema = LogbookDataSchema.extend({
  employee_name: z.string(),
  project_name: z.string().nullable(),
  vehicle_registration_identifier: z.string(),
})

const LogbookListSchema = z.object({
  data: z.array(LogbookListDataSchema),
}).merge(PaginationSchema)

const LogbookEntrySchema = z.object({
  data: LogbookDataSchema,
})

export type LogbookData = z.infer<typeof LogbookDataSchema>;
export type LogbookMutableData = Partial<LogbookData>;
export type LogbookEntry = z.infer<typeof LogbookEntrySchema>;
export type LogbookListEntry = z.infer<typeof LogbookListDataSchema>;

export type LogbookFilters = {
  start?: Date,
  end?: Date,
  employee?: SelectOption,
  project?: SelectOption,
  vehicle?: SelectOption,
  show_only_own: boolean,
};


export const useGetLogbook = (filters: LogbookFilters) => {
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
      params.vehicle_id = filters.vehicle?.id;
    }
    if(filters.show_only_own) {
      params.only_own = filters.show_only_own;
    }

    setQueryString(new URLSearchParams(params).toString());
  }, [filters.start, filters.end, filters.employee?.id, filters.project?.id, filters.vehicle?.id, filters.show_only_own])

  return useInfiniteQuery(
    [
      'logbook', {filter: queryString}],
    async ({pageParam = 1}) => {
      const query = queryString ? `${queryString}&page=${pageParam}` : `page=${pageParam}`;

      return useApiClient(
        auth,
        `${API_BASE_URL}/logbook?${query}`,
        {schema: LogbookListSchema}
      );
    }, {
      getNextPageParam: lastPage => {
        return lastPage.meta.current_page < lastPage.meta.last_page ? lastPage.meta.current_page+1 : undefined;
      },
      keepPreviousData: true,
    });
}

export const useGetLogbookEntry = (id: number) => {
  const auth = useAuth();

  return useQuery(
    ['logbook', id],
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/logbook/${id}`,
        { schema: LogbookEntrySchema }
      );
    });
}

export const useCreateLogbookEntry = () => {
  const auth = useAuth();
  const queryClient = useQueryClient()

  return useMutation((data: LogbookMutableData) => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/logbook`,
        { options: { method: 'POST', body: JSON.stringify(data) } }
      )
    },{
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'logbook' })
        queryClient.invalidateQueries({ queryKey: ['vehicle', 'kilometres'] })
        queryClient.invalidateQueries({ queryKey: 'dashboard' })
      }
    }
  )
}

export type UpdateLogbookEntryProps = {
  id: number,
  data: LogbookMutableData,
}

export const useUpdateLogbookEntry = () => {
  const auth = useAuth();
  const queryClient = useQueryClient()

  return useMutation(({id, data}: UpdateLogbookEntryProps) => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/logbook/${id}`,
        { options: { method: 'PATCH', body: JSON.stringify(data) } }
      )
    },{
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'logbook' })
        queryClient.invalidateQueries({ queryKey: ['vehicle', 'kilometres'] })
        queryClient.invalidateQueries({ queryKey: 'dashboard' })
      }
    }
  )
}

export const useDestroyLogbookEntry = () => {
  const auth = useAuth();
  const queryClient = useQueryClient()

  return useMutation((id: number) => {
      return useApiClient(
      auth,
      `${API_BASE_URL}/logbook/${id}`,
        { options: { method: 'DELETE' } }
      )
    },{
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'logbook' })
        queryClient.invalidateQueries({ queryKey: ['vehicle', 'kilometres'] })
        queryClient.invalidateQueries({ queryKey: 'dashboard' })
      }
    }
  )
}

export const useGetLocationSelectOptions = () => {
  const auth = useAuth();

  return useQuery(
    ['logbook', 'location',  'selectoptions'],
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/logbook/location-select-options`,
        { schema: SelectOptionsSchema }
      );
    });
}