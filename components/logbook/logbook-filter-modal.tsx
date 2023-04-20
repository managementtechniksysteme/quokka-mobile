import * as React from 'react';
import { RefObject, useEffect, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { LogbookFilters } from '../../api/logbookEndpoint';
import { useGetEmployeeSelectOptions } from '../../api/employeeEndpoint';
import { useGetProjectSelectOptions } from '../../api/projectEndpoint';
import { useGetVehicleSelectOptions } from '../../api/vehicleEndpoint';
import { SelectOption } from '../../api/config/config';
import { Switch } from 'react-native-paper';
import { Pressable, Text, View } from 'react-native';
import { CustomBottomSheetBackdrop } from '../sheets/bottom-sheet-backdrop';
import { Feather } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SearchableSelectBottomSheetModal } from '../sheets/searchable-select-bottom-sheet-modal';
import { TextInput as TextInput } from '../forms/text-input';
import colors from 'tailwindcss/colors';
import { useNotification } from '../../context/notification';
import { ListLoadingSkeleton } from '../lists/list-loading-skeleton';
import { useUser } from '../../context/user';

export type LogbookFilterModalProps = {
  logbookFilterModalRef: RefObject<BottomSheetModal>;
  initialFilters?: LogbookFilters;
  onChange?: (filters: LogbookFilters) => void;
  onDismiss?: (filters: LogbookFilters) => void;
};

export const LogbookFilterModal = ({
  logbookFilterModalRef,
  initialFilters,
  onChange,
  onDismiss,
}: LogbookFilterModalProps) => {
  const { cannot } = useUser();
  const notification = useNotification();

  const {
    isLoading: employeeDataIsLoading,
    isError: employeeDataIsError,
    data: employeeData,
    error: employeeDataError,
  } = useGetEmployeeSelectOptions();
  const {
    isLoading: projectDataIsLoading,
    isError: projectDataIsError,
    data: projectData,
    error: projectDataError,
  } = useGetProjectSelectOptions();
  const {
    isLoading: vehicleDataIsLoading,
    isError: vehicleDataIsError,
    data: vehicleData,
    error: vehicleDataError,
  } = useGetVehicleSelectOptions();

  const [filters, setFilters] = useState<LogbookFilters>({
    start: initialFilters?.start || undefined,
    end: initialFilters?.end || undefined,
    employee: initialFilters?.employee || undefined,
    project: initialFilters?.project || undefined,
    vehicle: initialFilters?.vehicle || undefined,
    show_only_own: initialFilters?.show_only_own || true,
  });

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const employeeSelectModalRef = useRef<BottomSheetModal>(null);
  const projectSelectModalRef = useRef<BottomSheetModal>(null);
  const vehicleSelectModalRef = useRef<BottomSheetModal>(null);

  const openEmployeeSelectModal = () => {
    employeeSelectModalRef.current?.present();
  };

  const closeEmployeeSelectModal = () => {
    employeeSelectModalRef.current?.close();
  };

  const openProjectSelectModal = () => {
    projectSelectModalRef.current?.present();
  };

  const closeProjectSelectModal = () => {
    projectSelectModalRef.current?.close();
  };

  const openVehicleSelectModal = () => {
    vehicleSelectModalRef.current?.present();
  };

  const closeVehicleSelectModal = () => {
    vehicleSelectModalRef.current?.close();
  };

  const handleStartChange = (date?: Date) => {
    setShowStartDatePicker(false);
    setFilters({ ...filters, start: date });
  };

  const handleEndChange = (date?: Date) => {
    setShowEndDatePicker(false);
    setFilters({ ...filters, end: date });
  };

  const handleEmployeeChange = (employee?: SelectOption) => {
    closeEmployeeSelectModal();
    setFilters({ ...filters, employee: employee });
  };

  const handleProjectChange = (project?: SelectOption) => {
    closeProjectSelectModal();
    setFilters({ ...filters, project: project });
  };

  const handleVehicleChange = (vehicle?: SelectOption) => {
    closeVehicleSelectModal();
    setFilters({ ...filters, vehicle: vehicle });
  };

  const handleShowOnlyOwnChange = (showOnlyOwn: boolean) => {
    setFilters({
      ...filters,
      employee: showOnlyOwn ? undefined : filters.employee,
      show_only_own: showOnlyOwn,
    });
  };

  useEffect(() => {
    onChange && onChange(filters);
  }, [
    filters.start,
    filters.end,
    filters.employee?.id,
    filters.project?.id,
    filters.vehicle?.id,
    filters.show_only_own,
  ]);

  if (employeeDataIsError || projectDataIsError || vehicleDataIsError) {
    logbookFilterModalRef.current?.close();
    notification.showNotification(
      'Es ist ein Fehler beim Laden der Daten aufgetreten.',
      'danger'
    );
    return;
  }

  if (employeeData && projectData && vehicleData) {
    return (
      <View className='flex'>
        <BottomSheetModal
          ref={logbookFilterModalRef}
          snapPoints={['30%', '60%']}
          backdropComponent={CustomBottomSheetBackdrop}
          onDismiss={() => onDismiss && onDismiss(filters)}
        >
          <BottomSheetView>
            <View className='px-5'>
              <View className='mb-3 flex-row justify-between border-b border-slate-200 pb-1'>
                <Text className='text-xl tracking-wide'>Filter</Text>
                <Pressable
                  className='self-center'
                  onPress={() => logbookFilterModalRef?.current?.close()}
                >
                  <Text>
                    <Feather name='x' size={24} />
                  </Text>
                </Pressable>
              </View>

              {employeeDataIsLoading ||
              projectDataIsLoading ||
              vehicleDataIsLoading ? (
                <ListLoadingSkeleton elements={2} />
              ) : (
                <View>
                  <DateTimePickerModal
                    isVisible={showStartDatePicker}
                    mode='date'
                    date={filters.start}
                    display='inline'
                    onConfirm={handleStartChange}
                    onCancel={() => setShowStartDatePicker(false)}
                  />
                  <TextInput
                    label='Start Datum'
                    value={filters.start?.toLocaleDateString() ?? ''}
                    placeholder='Start Datum'
                    pressable={true}
                    onPress={() => setShowStartDatePicker(true)}
                    left={<Feather name='calendar' size={24} />}
                    right={
                      <Pressable onPress={() => handleStartChange(undefined)}>
                        <Feather
                          color={colors.slate['400']}
                          name='x'
                          size={24}
                        />
                      </Pressable>
                    }
                  />

                  <View className='h-4' />

                  <DateTimePickerModal
                    isVisible={showEndDatePicker}
                    mode='date'
                    date={filters.end}
                    display='inline'
                    onConfirm={handleEndChange}
                    onCancel={() => setShowEndDatePicker(false)}
                  />
                  <TextInput
                    label='Ende Datum'
                    value={filters.end?.toLocaleDateString() ?? ''}
                    placeholder='Ende Datum'
                    pressable={true}
                    onPress={() => setShowEndDatePicker(true)}
                    left={<Feather name='calendar' size={24} />}
                    right={
                      <Pressable onPress={() => handleEndChange(undefined)}>
                        <Feather
                          color={colors.slate['400']}
                          name='x'
                          size={24}
                        />
                      </Pressable>
                    }
                  />

                  <View className='h-4' />

                  <SearchableSelectBottomSheetModal
                    options={vehicleData.data}
                    optionKey='id'
                    valueKey='text'
                    searchInputPlaceholder='Fahrzeug suchen'
                    onSelect={handleVehicleChange}
                    modalRef={vehicleSelectModalRef}
                  />
                  <TextInput
                    label='Fahrzeug'
                    value={filters.vehicle?.text ?? ''}
                    placeholder='Fahrzeug'
                    pressable={true}
                    onPress={() => openVehicleSelectModal()}
                    left={<Feather name='truck' size={24} />}
                    right={
                      <Pressable onPress={() => handleVehicleChange(undefined)}>
                        <Feather
                          color={colors.slate['400']}
                          name='x'
                          size={24}
                        />
                      </Pressable>
                    }
                  />

                  <View className='h-4' />

                  <SearchableSelectBottomSheetModal
                    options={projectData.data}
                    optionKey='id'
                    valueKey='text'
                    searchInputPlaceholder='Projekt suchen'
                    onSelect={handleProjectChange}
                    modalRef={projectSelectModalRef}
                  />
                  <TextInput
                    label='Projekt'
                    value={filters.project?.text ?? ''}
                    placeholder='Projekt'
                    pressable={true}
                    onPress={() => openProjectSelectModal()}
                    left={<Feather name='clipboard' size={24} />}
                    right={
                      <Pressable onPress={() => handleProjectChange(undefined)}>
                        <Feather
                          color={colors.slate['400']}
                          name='x'
                          size={24}
                        />
                      </Pressable>
                    }
                  />

                  <View className='h-4' />

                  {/* <SearchableSelectBottomSheetModal
                    options={employeeData.data}
                    optionKey='id'
                    valueKey='text'
                    searchInputPlaceholder='Mitarbeiter suchen'
                    onSelect={handleEmployeeChange}
                    modalRef={employeeSelectModalRef}
                  />
                  <TextInput
                    label='Mitarbeiter'
                    value={filters.employee?.text ?? ''}
                    placeholder='Mitarbeiter'
                    pressable={true}
                    onPress={() => openEmployeeSelectModal()}
                    left={
                      <Feather
                        name='user'
                        size={24}
                      />
                    }
                    right={
                      <Pressable onPress={() => handleEmployeeChange(undefined)}>
                        <Feather
                          name='x'
                          size={24}
                        />
                      </Pressable>
                    }
                  />*/}

                  <View className='h-4' />

                  <View className='flex-row items-center gap-2'>
                    <Switch
                      value={filters.show_only_own}
                      onValueChange={handleShowOnlyOwnChange}
                      disabled={cannot('logbook.view.other')}
                    />
                    <Text className='text-lg text-slate-700'>
                      Nur eigene Einträge anzeigen
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    );
  }
};
