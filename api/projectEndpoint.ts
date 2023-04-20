import {z} from "zod";
import {useAuth} from "../context/auth";
import {useQuery} from "react-query";
import {useApiClient} from "./config/client";
import {API_BASE_URL, SelectOptionsSchema} from "./config/config";

const ProjectDataSchema = z.object({
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

const ProjectSchema = z.object({
  data: ProjectDataSchema,
})

const ProjectListSchema = z.object({
  data: z.array(ProjectDataSchema),
});

export type Project = z.infer<typeof ProjectDataSchema>

export const useGetProjects = () => {
  const auth = useAuth();

  return useQuery(
    'projects',
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/projects`,
        { schema: ProjectListSchema }
      );
    });
}

export const useGetProjectSelectOptions = () => {
  const auth = useAuth();

  return useQuery(
    ['project', 'selectoptions'],
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/projects/select-options`,
        { schema: SelectOptionsSchema }
      );
    });
}

export const useGetProject = (id: number) => {
  const auth = useAuth();

  return useQuery(
    ['project', id],
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/projects/${id}`,
        { schema: ProjectSchema }
      );
    });
}