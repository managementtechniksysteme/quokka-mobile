import { ScrollView, Text, View } from 'react-native';
import { useGetDashboardData } from '../../api/dashboardEndpoint';
import { ListErrorState } from '../../components/lists/list-error-state';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DashboardLoadingSkeleton } from '../../components/dashboard/dashboard-loading-skeleton';
import { useUser } from '../../context/user';

export default function DashboardScreen() {
  const { can } = useUser();
  const { isLoading, isError, isRefetching, data, refetch } =
    useGetDashboardData();

  if (isLoading || (isError && isRefetching)) {
    return <DashboardLoadingSkeleton />;
  }

  if (isError) {
    return <ListErrorState onRefetch={refetch} />;
  }

  if (data) {
    return (
      <SafeAreaProvider>
        <SafeAreaView>
          <ScrollView className='bg-white p-3'>
            {can('accounting.view.own') && (
              <View className='flex-col gap-3 '>
                <Text className='self-center text-2xl font-light tracking-wide text-slate-900'>
                  Leistungen diesen Monat
                </Text>
                <View
                  className={`w-100 h-28 ${
                    data.data.mtd_hourly_based_services === 0
                      ? 'bg-slate-100'
                      : 'bg-slate-300'
                  } rounded-xl p-5`}
                >
                  <View className='h-full flex-row items-center'>
                    <View className='h-full flex-grow flex-col'>
                      <View className='mb-2 flex-row items-center gap-2'>
                        <Text className='text-slate-700'>
                          <MaterialCommunityIcons
                            name='clock-outline'
                            size={32}
                          />
                        </Text>
                        <Text className='text-3xl uppercase tracking-wide text-slate-700'>
                          Stunden
                        </Text>
                      </View>
                    </View>
                    <Text className='text-5xl tracking-wide text-slate-700'>
                      {data.data.mtd_hourly_based_services}
                    </Text>
                  </View>
                </View>
                <View
                  className={`w-100 h-28 ${
                    data.data.mtd_allowances === 0
                      ? 'bg-orange-100'
                      : 'bg-orange-300'
                  } rounded-xl p-5`}
                >
                  <View className='h-full flex-row items-center'>
                    <View className='h-full flex-grow flex-col'>
                      <View className='mb-2 flex-row items-center gap-2'>
                        <Text className='text-orange-700'>
                          <Ionicons name='md-wallet-outline' size={32} />
                        </Text>
                        <Text className='text-3xl uppercase tracking-wide text-orange-700'>
                          Diäten
                        </Text>
                      </View>
                      <View className='flex-row items-center gap-4'>
                        <Text className='text-lg tracking-wide text-orange-600'>
                          {data.data.mtd_allowances_in_currency}
                          {data.data.currency_unit}
                        </Text>
                      </View>
                    </View>
                    <Text className='text-5xl tracking-wide text-orange-700'>
                      {data.data.mtd_allowances}
                    </Text>
                  </View>
                </View>
                <View
                  className={`w-100 h-28 ${
                    data.data.mtd_overtime === 0
                      ? 'bg-orange-100'
                      : 'bg-orange-300'
                  } rounded-xl p-5`}
                >
                  <View className='h-full flex-row items-center'>
                    <View className='h-full flex-grow flex-col'>
                      <View className='mb-2 flex-row items-center gap-2'>
                        <Text className='text-orange-700'>
                          <MaterialCommunityIcons
                            name='plus-circle-outline'
                            size={32}
                          />
                        </Text>
                        <Text className='text-3xl uppercase tracking-wide text-orange-700'>
                          Überstunden
                        </Text>
                      </View>
                      <View className='flex-row items-center gap-4'>
                        <Text className='text-lg tracking-wide text-orange-600'>
                          {data.data.mtd_overtime_50}h 50%
                        </Text>
                        <Text className='text-lg tracking-wide text-orange-600'>
                          {data.data.mtd_overtime_50}h 100%
                        </Text>
                      </View>
                    </View>
                    <Text className='text-5xl tracking-wide text-orange-700'>
                      {data.data.mtd_overtime}
                    </Text>
                  </View>
                </View>
                <View
                  className={`w-100 h-28 ${
                    data.data.mtd_kilometres === 0
                      ? 'bg-blue-100'
                      : 'bg-blue-300'
                  } rounded-xl p-5`}
                >
                  <View className='h-full flex-row items-center'>
                    <View className='h-full flex-grow flex-col'>
                      <View className='mb-2 flex-row items-center gap-2'>
                        <Text className='text-blue-700'>
                          <MaterialCommunityIcons
                            name='truck-outline'
                            size={32}
                          />
                        </Text>
                        <Text className='text-3xl uppercase tracking-wide text-blue-700'>
                          Kilometer
                        </Text>
                      </View>
                      <View className='flex-row items-center gap-4'>
                        <Text className='text-lg tracking-wide text-blue-600'>
                          {data.data.mtd_company_kilometres} Firma
                        </Text>
                        <Text className='text-lg tracking-wide text-blue-600'>
                          {data.data.mtd_private_kilometres} privat (
                          {data.data.mtd_private_kilometres_in_currency}
                          {data.data.currency_unit})
                        </Text>
                      </View>
                    </View>
                    <Text className='text-5xl tracking-wide text-blue-700'>
                      {data.data.mtd_kilometres}
                    </Text>
                  </View>
                </View>
                <View
                  className={`w-100 h-28 ${
                    data.data.holidays <= 0 ? 'bg-green-100' : 'bg-green-300'
                  } rounded-xl p-5`}
                >
                  <View className='h-full flex-row items-center'>
                    <View className='h-full flex-grow flex-col'>
                      <View className='mb-2 flex-row items-center gap-2'>
                        <Text className='text-green-700'>
                          <MaterialCommunityIcons
                            name='weather-sunny'
                            size={32}
                          />
                        </Text>
                        <Text className='text-3xl uppercase tracking-wide text-green-700'>
                          Urlaub
                        </Text>
                      </View>
                      <View className='flex-row items-center gap-4'>
                        <Text className='text-lg tracking-wide text-green-600'>
                          Tage verfügbar
                        </Text>
                      </View>
                    </View>
                    <Text className='text-5xl tracking-wide text-green-700'>
                      {data.data.holidays}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            <View className='mt-0.5 flex-col gap-3'>
              <Text className='self-center text-2xl font-light tracking-wide text-slate-900'>
                Aufgaben
              </Text>
              <View
                className={`w-100 h-28 ${
                  data.data.mtd_created_tasks === 0
                    ? 'bg-blue-100'
                    : 'bg-blue-300'
                } rounded-xl p-5`}
              >
                <View className='h-full flex-row items-center'>
                  <View className='h-full flex-grow flex-col'>
                    <View className='mb-2 flex-row items-center gap-2'>
                      <Text className='text-blue-700'>
                        <MaterialCommunityIcons
                          name='plus-box-outline'
                          size={32}
                        />
                      </Text>
                      <Text className='text-3xl uppercase tracking-wide text-blue-700'>
                        Erstellt
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-4'>
                      <Text className='text-lg tracking-wide text-blue-600'>
                        {data.data.mtd_created_tasks_responsible_for} ver.
                      </Text>
                      <Text className='text-lg tracking-wide text-blue-600'>
                        {data.data.mtd_created_tasks_involved_in} bet.
                      </Text>
                    </View>
                  </View>
                  <Text className='text-5xl tracking-wide text-blue-700'>
                    {data.data.mtd_created_tasks}
                  </Text>
                </View>
              </View>
              <View
                className={`w-100 h-28 ${
                  data.data.mtd_finished_tasks === 0
                    ? 'bg-green-100'
                    : 'bg-green-300'
                } rounded-xl p-5`}
              >
                <View className='h-full flex-row items-center'>
                  <View className='h-full flex-grow flex-col'>
                    <View className='mb-2 flex-row items-center gap-2'>
                      <Text className='text-green-700'>
                        <MaterialCommunityIcons
                          name='checkbox-marked-outline'
                          size={32}
                        />
                      </Text>
                      <Text className='text-3xl uppercase tracking-wide text-green-700'>
                        Erledigt
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-4'>
                      <Text className='text-lg tracking-wide text-green-600'>
                        {data.data.mtd_finished_tasks_responsible_for} ver.
                      </Text>
                      <Text className='text-lg tracking-wide text-green-600'>
                        {data.data.mtd_finished_tasks_involved_in} bet.
                      </Text>
                    </View>
                  </View>
                  <Text className='text-5xl tracking-wide text-green-700'>
                    {data.data.mtd_finished_tasks}
                  </Text>
                </View>
              </View>
              <View
                className={`w-100 h-28 ${
                  data.data.overdue_tasks === 0 ? 'bg-red-100' : 'bg-red-300'
                } rounded-xl p-5`}
              >
                <View className='h-full flex-row items-center'>
                  <View className='h-full flex-grow flex-col'>
                    <View className='mb-2 flex-row items-center gap-2'>
                      <Text className='text-red-700'>
                        <MaterialCommunityIcons
                          name='calendar-remove-outline'
                          size={32}
                        />
                      </Text>
                      <Text className='text-3xl uppercase tracking-wide text-red-700'>
                        Überfällig
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-4'>
                      <Text className='text-lg tracking-wide text-red-600'>
                        {data.data.overdue_tasks_responsible_for} ver.
                      </Text>
                      <Text className='text-lg tracking-wide text-red-600'>
                        {data.data.overdue_tasks_involved_in} bet.
                      </Text>
                    </View>
                  </View>
                  <Text className='text-5xl tracking-wide text-red-700'>
                    {data.data.overdue_tasks}
                  </Text>
                </View>
              </View>
              <View
                className={`w-100 h-28 ${
                  data.data.due_soon_tasks === 0
                    ? 'bg-yellow-100'
                    : 'bg-yellow-300'
                } rounded-xl p-5`}
              >
                <View className='h-full flex-row items-center'>
                  <View className='h-full flex-grow flex-col'>
                    <View className='mb-2 flex-row items-center gap-2'>
                      <Text className='text-yellow-700'>
                        <MaterialCommunityIcons
                          name='calendar-outline'
                          size={32}
                        />
                      </Text>
                      <Text className='text-3xl uppercase tracking-wide text-yellow-700'>
                        Bald fällig
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-4'>
                      <Text className='text-lg tracking-wide text-yellow-600'>
                        {data.data.due_soon_tasks_responsible_for} ver.
                      </Text>
                      <Text className='text-lg tracking-wide text-yellow-600'>
                        {data.data.due_soon_tasks_involved_in} bet.
                      </Text>
                    </View>
                  </View>
                  <Text className='text-5xl tracking-wide text-yellow-700'>
                    {data.data.due_soon_tasks}
                  </Text>
                </View>
              </View>
            </View>
            <View className='mt-0.5 flex-col gap-3'>
              <Text className='self-center text-2xl font-light tracking-wide text-slate-900'>
                Berichte
              </Text>
              <View
                className={`w-100 h-28 ${
                  data.data.new_service_reports === 0
                    ? 'bg-blue-100'
                    : 'bg-blue-300'
                } rounded-xl p-5`}
              >
                <View className='h-full flex-row items-center'>
                  <View className='h-full flex-grow flex-col'>
                    <View className='mb-2 flex-row items-center gap-2'>
                      <Text className='text-blue-700'>
                        <MaterialCommunityIcons name='cog-outline' size={32} />
                      </Text>
                      <Text className='text-3xl uppercase tracking-wide text-blue-700'>
                        Offene SB
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-4'>
                      <Text className='text-lg tracking-wide text-blue-600'>
                        {data.data.mtd_new_service_reports} MTD
                      </Text>
                      {can([
                        'service-reports.view.own',
                        'service-reports.view.other',
                      ]) && (
                        <Text className='text-lg tracking-wide text-blue-600'>
                          {data.data.new_service_reports_total} ges.
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text className='text-5xl tracking-wide text-blue-700'>
                    {data.data.new_service_reports}
                  </Text>
                </View>
              </View>
              <View
                className={`w-100 h-28 ${
                  data.data.new_additions_reports === 0
                    ? 'bg-blue-100'
                    : 'bg-blue-300'
                } rounded-xl p-5`}
              >
                <View className='h-full flex-row items-center'>
                  <View className='h-full flex-grow flex-col'>
                    <View className='mb-2 flex-row items-center gap-2'>
                      <Text className='text-blue-700'>
                        <MaterialCommunityIcons name='tools' size={32} />
                      </Text>
                      <Text className='text-3xl uppercase tracking-wide text-blue-700'>
                        Offene RB
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-4'>
                      <Text className='text-lg tracking-wide text-blue-600'>
                        {data.data.mtd_new_additions_reports} MTD
                      </Text>
                      {can([
                        'additions-reports.view.own',
                        'additions-reports.view.involved',
                      ]) && (
                        <Text className='text-lg tracking-wide text-blue-600'>
                          {data.data.new_additions_reports_involved_in} bet.
                        </Text>
                      )}
                      {can([
                        'additions-reports.view.own',
                        'additions-reports.view.involved',
                        'additions-reports.view.other',
                      ]) && (
                        <Text className='text-lg tracking-wide text-blue-600'>
                          {data.data.new_additions_reports_total} ges.
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text className='text-5xl tracking-wide text-blue-700'>
                    {data.data.new_additions_reports}
                  </Text>
                </View>
              </View>
              <View
                className={`w-100 h-28 ${
                  data.data.new_inspection_reports === 0
                    ? 'bg-blue-100'
                    : 'bg-blue-300'
                } rounded-xl p-5`}
              >
                <View className='h-full flex-row items-center'>
                  <View className='h-full flex-grow flex-col'>
                    <View className='mb-2 flex-row items-center gap-2'>
                      <Text className='text-blue-700'>
                        <MaterialCommunityIcons
                          name='check-decagram-outline'
                          size={32}
                        />
                      </Text>
                      <Text className='text-3xl uppercase tracking-wide text-blue-700'>
                        Offene PB
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-4'>
                      <Text className='text-lg tracking-wide text-blue-600'>
                        {data.data.mtd_new_inspection_reports} MTD
                      </Text>
                      {can([
                        'inspection-reports.view.own',
                        'inspection-reports.view.other',
                      ]) && (
                        <Text className='text-lg tracking-wide text-blue-600'>
                          {data.data.new_inspection_reports_total} ges.
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text className='text-5xl tracking-wide text-blue-700'>
                    {data.data.new_inspection_reports}
                  </Text>
                </View>
              </View>
              <View
                className={`w-100 h-28 ${
                  data.data.new_construction_reports === 0
                    ? 'bg-blue-100'
                    : 'bg-blue-300'
                } rounded-xl p-5`}
              >
                <View className='h-full flex-row items-center'>
                  <View className='h-full flex-grow flex-col'>
                    <View className='mb-2 flex-row items-center gap-2'>
                      <Text className='text-blue-700'>
                        <MaterialCommunityIcons name='hammer' size={32} />
                      </Text>
                      <Text className='text-3xl uppercase tracking-wide text-blue-700'>
                        Offene BT
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-4'>
                      <Text className='text-lg tracking-wide text-blue-600'>
                        {data.data.mtd_new_construction_reports} MTD
                      </Text>
                      {can([
                        'construction-reports.view.own',
                        'construction-reports.view.involved',
                      ]) && (
                        <Text className='text-lg tracking-wide text-blue-600'>
                          {data.data.new_construction_reports_involved_in} bet.
                        </Text>
                      )}
                      {can([
                        'construction-reports.view.own',
                        'construction-reports.view.involved',
                        'construction-reports.view.other',
                      ]) && (
                        <Text className='text-lg tracking-wide text-blue-600'>
                          {data.data.new_construction_reports_total} ges.
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text className='text-5xl tracking-wide text-blue-700'>
                    {data.data.new_construction_reports}
                  </Text>
                </View>
              </View>
              <View
                className={`w-100 h-28 ${
                  data.data.new_flow_meter_inspection_reports === 0
                    ? 'bg-blue-100'
                    : 'bg-blue-300'
                } rounded-xl p-5`}
              >
                <View className='h-full flex-row items-center'>
                  <View className='h-full flex-grow flex-col'>
                    <View className='mb-2 flex-row items-center gap-2'>
                      <Text className='text-blue-700'>
                        <MaterialCommunityIcons
                          name='water-check-outline'
                          size={32}
                        />
                      </Text>
                      <Text className='text-3xl uppercase tracking-wide text-blue-700'>
                        Offene DM
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-4'>
                      <Text className='text-lg tracking-wide text-blue-600'>
                        {data.data.mtd_new_flow_meter_inspection_reports} MTD
                      </Text>
                      {can([
                        'flow-meter-inspection-reports.view.own',
                        'flow-meter-inspection-reports.view.other',
                      ]) && (
                        <Text className='text-lg tracking-wide text-blue-600'>
                          {data.data.new_flow_meter_inspection_reports_total}{' '}
                          ges.
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text className='text-5xl tracking-wide text-blue-700'>
                    {data.data.new_flow_meter_inspection_reports}
                  </Text>
                </View>
              </View>
              {can('service-reports.approve') && (
                <View
                  className={`w-100 h-28 ${
                    data.data.signed_service_reports === 0
                      ? 'bg-yellow-100'
                      : 'bg-yellow-300'
                  } rounded-xl p-5`}
                >
                  <View className='h-full flex-row items-center'>
                    <View className='h-full flex-grow flex-col'>
                      <View className='mb-2 flex-row items-center gap-2'>
                        <Text className='text-yellow-700'>
                          <MaterialCommunityIcons
                            name='cog-outline'
                            size={32}
                          />
                        </Text>
                        <Text className='text-3xl uppercase tracking-wide text-yellow-700'>
                          Erledigbare SB
                        </Text>
                      </View>
                      <View className='flex-row items-center gap-4'>
                        <Text className='text-lg tracking-wide text-yellow-600'>
                          {data.data.mtd_signed_service_reports} MTD
                        </Text>
                      </View>
                    </View>
                    <Text className='text-5xl tracking-wide text-yellow-700'>
                      {data.data.signed_service_reports}
                    </Text>
                  </View>
                </View>
              )}
              {can('additions-reports.approve') && (
                <View
                  className={`w-100 h-28 ${
                    data.data.signed_additions_reports === 0
                      ? 'bg-yellow-100'
                      : 'bg-yellow-300'
                  } rounded-xl p-5`}
                >
                  <View className='h-full flex-row items-center'>
                    <View className='h-full flex-grow flex-col'>
                      <View className='mb-2 flex-row items-center gap-2'>
                        <Text className='text-yellow-700'>
                          <MaterialCommunityIcons name='tools' size={32} />
                        </Text>
                        <Text className='text-3xl uppercase tracking-wide text-yellow-700'>
                          Erledigbare RB
                        </Text>
                      </View>
                      <View className='flex-row items-center gap-4'>
                        <Text className='text-lg tracking-wide text-yellow-600'>
                          {data.data.mtd_signed_additions_reports} MTD
                        </Text>
                      </View>
                    </View>
                    <Text className='text-5xl tracking-wide text-yellow-700'>
                      {data.data.signed_additions_reports}
                    </Text>
                  </View>
                </View>
              )}
              {can('inspection-reports.approve') && (
                <View
                  className={`w-100 h-28 ${
                    data.data.signed_inspection_reports === 0
                      ? 'bg-yellow-100'
                      : 'bg-yellow-300'
                  } rounded-xl p-5`}
                >
                  <View className='h-full flex-row items-center'>
                    <View className='h-full flex-grow flex-col'>
                      <View className='mb-2 flex-row items-center gap-2'>
                        <Text className='text-yellow-700'>
                          <MaterialCommunityIcons
                            name='check-decagram-outline'
                            size={32}
                          />
                        </Text>
                        <Text className='text-3xl uppercase tracking-wide text-yellow-700'>
                          Erledigbare PB
                        </Text>
                      </View>
                      <View className='flex-row items-center gap-4'>
                        <Text className='text-lg tracking-wide text-yellow-600'>
                          {data.data.mtd_signed_inspection_reports} MTD
                        </Text>
                      </View>
                    </View>
                    <Text className='text-5xl tracking-wide text-yellow-700'>
                      {data.data.signed_inspection_reports}
                    </Text>
                  </View>
                </View>
              )}
              {can('construction-reports.approve') && (
                <View
                  className={`w-100 h-28 ${
                    data.data.signed_construction_reports === 0
                      ? 'bg-yellow-100'
                      : 'bg-yellow-300'
                  } rounded-xl p-5`}
                >
                  <View className='h-full flex-row items-center'>
                    <View className='h-full flex-grow flex-col'>
                      <View className='mb-2 flex-row items-center gap-2'>
                        <Text className='text-yellow-700'>
                          <MaterialCommunityIcons name='hammer' size={32} />
                        </Text>
                        <Text className='text-3xl uppercase tracking-wide text-yellow-700'>
                          Erledigbare BT
                        </Text>
                      </View>
                      <View className='flex-row items-center gap-4'>
                        <Text className='text-lg tracking-wide text-yellow-600'>
                          {data.data.mtd_signed_construction_reports} MTD
                        </Text>
                      </View>
                    </View>
                    <Text className='text-5xl tracking-wide text-yellow-700'>
                      {data.data.signed_construction_reports}
                    </Text>
                  </View>
                </View>
              )}
              {can('flow-meter-inspection-reports.approve') && (
                <View
                  className={`w-100 h-28 ${
                    data.data.signed_flow_meter_inspection_reports === 0
                      ? 'bg-yellow-100'
                      : 'bg-yellow-300'
                  } rounded-xl p-5`}
                >
                  <View className='h-full flex-row items-center'>
                    <View className='h-full flex-grow flex-col'>
                      <View className='mb-2 flex-row items-center gap-2'>
                        <Text className='text-yellow-700'>
                          <MaterialCommunityIcons
                            name='water-check-outline'
                            size={32}
                          />
                        </Text>
                        <Text className='text-3xl uppercase tracking-wide text-yellow-700'>
                          Erledigbare DM
                        </Text>
                      </View>
                      <View className='flex-row items-center gap-4'>
                        <Text className='text-lg tracking-wide text-yellow-600'>
                          {data.data.mtd_signed_flow_meter_inspection_reports}{' '}
                          MTD
                        </Text>
                      </View>
                    </View>
                    <Text className='text-5xl tracking-wide text-yellow-700'>
                      {data.data.signed_flow_meter_inspection_reports}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            <View className='h-4' />
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}
