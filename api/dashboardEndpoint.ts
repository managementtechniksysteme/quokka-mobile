import {z} from "zod";
import {useAuth} from "../context/auth";
import {useQuery} from "react-query";
import {useApiClient} from "./config/client";
import {API_BASE_URL} from "./config/config";

const DashboardDataSchema = z.object({
  due_soon_tasks: z.number(),
  due_soon_tasks_involved_in: z.number(),
  due_soon_tasks_responsible_for: z.number(),
  overdue_tasks: z.number(),
  overdue_tasks_involved_in: z.number(),
  overdue_tasks_responsible_for: z.number(),
  mtd_allowances: z.number(),
  mtd_allowances_in_currency: z.number(),
  currency_unit: z.string(),
  mtd_company_kilometres: z.number(),
  mtd_created_tasks: z.number(),
  mtd_created_tasks_involved_in: z.number(),
  mtd_created_tasks_responsible_for: z.number(),
  mtd_finished_tasks: z.number(),
  mtd_finished_tasks_involved_in: z.number(),
  mtd_finished_tasks_responsible_for: z.number(),
  mtd_hourly_based_services: z.number(),
  mtd_kilometres: z.number(),
  new_additions_reports : z.number(),
  mtd_new_additions_reports: z.number(),
  new_additions_reports_involved_in: z.number().optional(),
  new_additions_reports_total: z.number().optional(),
  new_construction_reports : z.number(),
  mtd_new_construction_reports: z.number(),
  new_construction_reports_involved_in: z.number().optional(),
  new_construction_reports_total: z.number().optional(),
  new_flow_meter_inspection_reports : z.number(),
  mtd_new_flow_meter_inspection_reports: z.number(),
  new_flow_meter_inspection_reports_total: z.number().optional(),
  new_inspection_reports : z.number(),
  mtd_new_inspection_reports: z.number(),
  new_inspection_reports_total: z.number().optional(),
  new_service_reports : z.number(),
  mtd_new_service_reports: z.number(),
  new_service_reports_total: z.number().optional(),
  mtd_overtime: z.number(),
  mtd_overtime_50: z.number(),
  mtd_overtime_100: z.number(),
  mtd_private_kilometres: z.number(),
  mtd_private_kilometres_in_currency: z.number(),
  signed_service_reports: z.optional(z.number()),
  mtd_signed_service_reports: z.optional(z.number()),
  signed_additions_reports: z.optional(z.number()),
  mtd_signed_additions_reports: z.optional(z.number()),
  signed_inspection_reports: z.optional(z.number()),
  mtd_signed_inspection_reports: z.optional(z.number()),
  signed_construction_reports: z.optional(z.number()),
  mtd_signed_construction_reports: z.optional(z.number()),
  signed_flow_meter_inspection_reports: z.optional(z.number()),
  mtd_signed_flow_meter_inspection_reports: z.optional(z.number()),
  holidays: z.number(),
})

export const DashboardSchema = z.object({
  data: DashboardDataSchema,
})

export type DashboardData = z.infer<typeof DashboardDataSchema>

export const useGetDashboardData = () => {
  const auth = useAuth();

  return useQuery(
    'dashboard',
    async () => {
      return useApiClient(
        auth,
        `${API_BASE_URL}/dashboard`,
        { schema: DashboardSchema }
      );
    });
}