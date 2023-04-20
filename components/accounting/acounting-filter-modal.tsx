import * as React from 'react';
import { RefObject, useEffect, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useGetEmployeeSelectOptions } from '../../api/employeeEndpoint';
import { useGetProjectSelectOptions } from '../../api/projectEndpoint';
import { SelectOption } from '../../api/config/config';
import { Switch } from 'react-native-paper';
import { Pressable, Text, View } from 'react-native';
import { CustomBottomSheetBackdrop } from '../sheets/bottom-sheet-backdrop';
import { Feather } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SearchableSelectBottomSheetModal } from '../sheets/searchable-select-bottom-sheet-modal';
import { TextInput as TextInput } from '../forms/text-input';
import colors from 'tailwindcss/colors';
import { useGetServiceSelectOptions } from '../../api/serviceEndpoint';
import { AccountingFilters } from '../../api/accountingEndpoint';
import { useNotification } from '../../context/notification';
import { ListLoadingSkeleton } from '../lists/list-loading-skeleton';
import { useUser } from '../../context/user';

export type AccountingFilterModalProps = {
  accountingFilterModalRef: RefObject<BottomSheetModal>;
  initialFilters?: AccountingFilters;
  onChange?: (filters: AccountingFilters) => void;
  onDismiss?: (filters: AccountingFilters) => void;
};

export const AccountingFilterModal = ({
  accountingFilterModalRef,
  initialFilters,
  onChange,
  onDismiss,
}: AccountingFilterModalProps) => {
  const { user, cannot } = useUser();
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
    isLoading: serviceDataIsLoading,
    isError: serviceDataIsError,
    data: serviceData,
    error: serviceDataError,
  } = useGetServiceSelectOptions();

  const [filters, setFilters] = useState<AccountingFilters>({
    start: initialFilters?.start || undefined,
    end: initialFilters?.end || undefined,
    employee: initialFilters?.employee || undefined,
    project: initialFilters?.project || undefined,
    service: initialFilters?.service || undefined,
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
  const serviceSelectModalRef = useRef<BottomSheetModal>(null);

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

  const openServiceSelectModal = () => {
    serviceSelectModalRef.current?.present();
  };

  const closeServiceSelectModal = () => {
    serviceSelectModalRef.current?.close();
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

  const handleServiceChange = (service?: SelectOption) => {
    closeServiceSelectModal();
    setFilters({ ...filters, service: service });
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
    filters.service?.id,
    filters.show_only_own,
  ]);

  if (employeeDataIsError || projectDataIsError || serviceDataIsError) {
    accountingFilterModalRef.current?.close();
    notification.showNotification(
      'Es ist ein Fehler beim Laden der Daten aufgetreten.',
      'danger'
    );
    return;
  }

  if (employeeData && projectData && serviceData) {
    return (
      <View className='flex'>
        <BottomSheetModal
          ref={accountingFilterModalRef}
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
                  onPress={() => accountingFilterModalRef?.current?.close()}
                >
                  <Text>
                    <Feather name='x' size={24} />
                  </Text>
                </Pressable>
              </View>

              {employeeDataIsLoading ||
              projectDataIsLoading ||
              serviceDataIsLoading ? (
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
                    options={serviceData.data}
                    optionKey='id'
                    valueKey='text'
                    searchInputPlaceholder='Leistung suchen'
                    onSelect={handleServiceChange}
                    modalRef={serviceSelectModalRef}
                  />
                  <TextInput
                    label='Leistung'
                    value={filters.service?.text ?? ''}
                    placeholder='Leistung'
                    pressable={true}
                    onPress={() => openServiceSelectModal()}
                    left={<Feather name='settings' size={24} />}
                    right={
                      <Pressable onPress={() => handleServiceChange(undefined)}>
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
                      disabled={cannot('accounting.view.other')}
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
