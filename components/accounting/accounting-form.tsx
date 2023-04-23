import { Platform, ScrollView, View } from 'react-native';
import { SelectOption, SelectOptionDataSchema } from '../../api/config/config';
import { undefined, z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from 'react-native-paper';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { SearchableSelectBottomSheetModal } from '../sheets/searchable-select-bottom-sheet-modal';
import { Feather } from '@expo/vector-icons';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { setServerErrors } from '../../utils/form';
import { TextInput } from '../forms/text-input';
import {
  useGetHourlyBasedServiceIds,
  useGetServiceTypes,
} from '../../api/serviceEndpoint';
import { useGetApplicationSettings } from '../../api/applicationSettingsEndpoint';
import { ListLoadingSkeleton } from '../lists/list-loading-skeleton';
import { useRouter } from 'expo-router';
import { useNotification } from '../../context/notification';
import {
  apiDate,
  apiTime,
  hourlyDurationFitsInInterval,
} from '../../utils/dateTime';
import { isMultipleOf } from '../../utils/numbers';

const AccountingFormSchema = z.object({
  service_id: SelectOptionDataSchema,
  service_provided_on: z.date(),
  service_provided_started_at: z.date().nullable(),
  service_provided_ended_at: z.date().nullable(),
  amount: z.coerce.number().positive({message: 'Mange muss positiv sein.'}),
  project_id: SelectOptionDataSchema,
  comment: z.string().nullable(),
});

export type AccountingFormSchema = z.infer<typeof AccountingFormSchema>;

export type AccountingFormProps = {
  accounting?: AccountingFormSchema | undefined;
  projects: SelectOption[];
  services: SelectOption[];
  onSubmit: (data: AccountingFormSchema, id?: number) => void;
};

export type AccountingFormApi = {
  submit: () => void;
  setErrors: (errors: Record<string, string>) => void;
};

export const AccountingForm = forwardRef<
  AccountingFormApi,
  AccountingFormProps
>(({ accounting, projects, services, onSubmit }, ref) => {
  const router = useRouter();
  const notification = useNotification();

  const {
    isLoading: applicationSettingsDataIsLoading,
    isError: applicationSettingsDataIsError,
    data: applicationSettingsData,
    error: applicationSettingsDataError,
  } = useGetApplicationSettings();
  const {
    isLoading: serviceTypesDataIsLoading,
    isError: serviceTypesDataIsError,
    data: serviceTypesData,
    error: serviceTypesDataError,
  } = useGetServiceTypes();
  const {
    isLoading: hourlyBasedServiceIdsDataIsLoading,
    isError: hourlyBasedServiceIdsDataIsError,
    data: hourlyBasedServiceIdsData,
    error: hourlyBasedServiceIdsDataError,
  } = useGetHourlyBasedServiceIds();

  const projectSelectModalRef = useRef<BottomSheetModal>(null);
  const serviceSelectModalRef = useRef<BottomSheetModal>(null);

  const [showServiceProvidedOnDatePicker, setShowServiceProvidedOnDatePicker] =
    useState(false);
  const [
    showServiceProvidedStartedAtDatePicker,
    setShowServiceProvidedStartedAtDatePicker,
  ] = useState(false);
  const [
    showServiceProvidedEndedAtDatePicker,
    setShowServiceProvidedEndedAtDatePicker,
  ] = useState(false);

  const [isHourlyBasedService, setIsHourlyBasedService] = useState(false);

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

  const handleServiceProvidedOnChange = (serviceProvidedOn: Date) => {
    setShowServiceProvidedOnDatePicker(false);
    setValue('service_provided_on', serviceProvidedOn);
  };

  const handleServiceProvidedStartedAtChange = (
    serviceProvidedStartedAt: Date
  ) => {
    setShowServiceProvidedStartedAtDatePicker(false);
    setValue('service_provided_started_at', serviceProvidedStartedAt);
    //autofillRemainingValue(currentStart, currentEnd, currentAmount)
  };

  const handleServiceProvidedEndedAtChange = (
    serviceProvidedEndeddAt: Date
  ) => {
    setShowServiceProvidedEndedAtDatePicker(false);
    setValue('service_provided_ended_at', serviceProvidedEndeddAt);
    //autofillRemainingValue(currentStart, currentEnd, currentAmount)
  };

  const handleProjectChange = (project?: SelectOption) => {
    closeProjectSelectModal();
    setValue('project_id', project || null);
  };

  const handleVServiceChange = (service: SelectOption) => {
    closeServiceSelectModal();
    setValue('service_id', service);

    if (service.id) {
      const isHourlyBasedServiceId =
        hourlyBasedServiceIdsData?.data.ids.includes(service.id);

      setIsHourlyBasedService(isHourlyBasedServiceId || false);

      if (!isHourlyBasedServiceId) {
        setValue('service_provided_started_at', null);
        setValue('service_provided_ended_at', null);
      }
    }
  };

  const autofillRemainingValue = (
    start?: Date,
    end?: Date,
    amount?: number
  ) => {
    if (start && end && !amount) {
      autofillAmount(start, end);
    } else if (start && amount && !end) {
      autofillEnd(start, amount);
    } else if (end && amount && !start) {
      autofillStart(end, amount);
    }
  };

  const autofillAmount = (start: Date, end: Date) => {
    if (!applicationSettingsData) {
      return;
    }

    if(start.getTime() >= end.getTime()) {
      return;
    }

    const minAmountMinutes =
      applicationSettingsData.data.accounting_min_amount * 60;
    const date = apiDate(new Date());

    const startDate = new Date(date + ' ' + apiTime(start));
    const endDate = new Date(date + ' ' + apiTime(end));

    const timeStartMinutes = startDate.getHours() * 60 + startDate.getMinutes();
    const timeEndMinutes = endDate.getHours() * 60 + endDate.getMinutes();

    let differenceMinutes = timeEndMinutes - timeStartMinutes;

    if (differenceMinutes >= minAmountMinutes) {
      differenceMinutes =
        differenceMinutes - (differenceMinutes % minAmountMinutes);
    }

    setValue('amount', differenceMinutes / 60);
  };

  const autofillStart = (end: Date, amount: number) => {
    const date = apiDate(new Date());

    const amountMilliseconds = amount * 60 * 60 * 1000;

    const timeEnd = new Date(date + ' ' + apiTime(end));
    const timeStart = new Date(timeEnd.getTime() - amountMilliseconds);

    setValue('service_provided_started_at', timeStart);
  };

  const autofillEnd = (start: Date, amount: number) => {
    const date = apiDate(new Date());

    const amountMilliseconds = amount * 60 * 60 * 1000;

    const timeStart = new Date(date + ' ' + apiTime(start));
    const timeEnd = new Date(timeStart.getTime() + amountMilliseconds);

    setValue('service_provided_ended_at', timeEnd);
  };

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AccountingFormSchema>({
    reValidateMode: 'onSubmit',
    resolver: zodResolver(AccountingFormSchema),
    defaultValues: {
      service_id: accounting?.service_id || null,
      service_provided_on: accounting?.service_provided_on || new Date(),
      service_provided_started_at:
        accounting?.service_provided_started_at || null,
      service_provided_ended_at: accounting?.service_provided_ended_at || null,
      amount: accounting?.amount || '',
      project_id: accounting?.project_id || null,
      comment: accounting?.comment || '',
    },
  });

  const currentStart = watch('service_provided_started_at', null);
  const currentEnd = watch('service_provided_ended_at', null);
  const currentAmount = watch('amount', null);

  useEffect(() => {
    const amountValue = currentAmount ? Number(currentAmount) : null;

    if (amountValue && Number.isNaN(amountValue)) {
      return;
    }

    autofillRemainingValue(currentStart, currentEnd, amountValue);
  }, [currentStart, currentEnd]);

  const handleExtendedValidationSubmit = (data: AccountingFormSchema) => {
    // a start or end time is provided for non hourly based services
    if (
      data.service_id.id &&
      hourlyBasedServiceIdsData &&
      !hourlyBasedServiceIdsData.data.ids.includes(data.service_id.id)
    ) {
      let error = false;

      if (data.service_provided_started_at) {
        setError('service_provided_started_at', {
          type: 'validation',
          message:
            'Das Start Datum darf nur bei stundenbasierten Leistungen angegeben werden',
        });
        error = true;
      }
      if (data.service_provided_started_at) {
        setError('service_provided_started_at', {
          type: 'validation',
          message:
            'Das Ende Datum darf nur bei stundenbasierten Leistungen angegeben werden',
        });
        error = true;
      }

      if (error) {
        return;
      }
    }

    // a start or end time is not provided for hourly based services
    if (
      data.service_id.id &&
      hourlyBasedServiceIdsData &&
      !hourlyBasedServiceIdsData.data.ids.includes(data.service_id.id)
    ) {
      let error = false;

      if (data.service_provided_started_at) {
        setError('service_provided_started_at', {
          type: 'validation',
          message:
            'Das Start Datum muss bei stundenbasierten Leistungen angegeben werden',
        });
        error = true;
      }

      if (data.service_provided_started_at) {
        setError('service_provided_started_at', {
          type: 'validation',
          message:
            'Das Ende Datum muss bei stundenbasierten Leistungen angegeben werden',
        });
        error = true;
      }

      if (error) {
        return;
      }
    }

    // times are provided in the wrong order
    if (
      data.service_provided_started_at &&
      data.service_provided_ended_at &&
      data.service_provided_started_at >= data.service_provided_ended_at
    ) {
      setError('service_provided_started_at', {
        type: 'validate',
        message: 'Der Start muss vor oder gleich dem Ende sein',
      });
      setError('service_provided_ended_at', {
        type: 'validation',
        message: 'Das Ende muss nach oder gleich dem Start sein',
      });
      return;
    }

    // the provided amount is not a multiple of the minimum required amount
    if (data.service_id.id && serviceTypesData) {
      const service = serviceTypesData.data.find(
        (service) => service.id === data.service_id.id
      );

      let error = false;

      if (
        service &&
        data.amount &&
        service.type === 'material' &&
        !isMultipleOf(data.amount, 0.01)
      ) {
        setError('amount', {
          type: 'validation',
          message: 'Die Menge muss ein Vielfaches von 0.01 sein',
        });
        error = true;
      }

      if (
        service &&
        data.amount &&
        applicationSettingsData &&
        service.type === 'wage' &&
        !isMultipleOf(
          data.amount,
          applicationSettingsData.data.accounting_min_amount
        )
      ) {
        setError('amount', {
          type: 'validation',
          message: `Die Menge muss ein Vielfaches von ${applicationSettingsData.data.accounting_min_amount} sein`,
        });
        error = true;
      }

      if (error) {
        return;
      }
    }

    // the provided amount does not fit into the provided time frame taking multiples of the minimum duration into account
    if (
      data.service_id.id &&
      data.service_provided_started_at &&
      data.service_provided_ended_at &&
      hourlyBasedServiceIdsData &&
      applicationSettingsData &&
      hourlyBasedServiceIdsData.data.ids.includes(data.service_id.id) &&
      !hourlyDurationFitsInInterval(
        data.amount,
        data.service_provided_started_at,
        data.service_provided_ended_at,
        applicationSettingsData?.data.accounting_min_amount
      )
    ) {
      setError('amount', {
        type: 'validation',
        message:
          'Die Menge darf den angegebenen Zeitbereich in Stunden nicht überschreiten',
      });
      return;
    }

    onSubmit(data);
  };

  const submitRef = useRef(handleSubmit);
  submitRef.current = handleSubmit;

  const setErrorRef = useRef(setError);
  setErrorRef.current = setError;

  useImperativeHandle(
    ref,
    () => {
      return {
        submit: handleSubmit(handleExtendedValidationSubmit),
        setErrors: (data) => setServerErrors(data, setError),
      };
    },
    []
  );

  if (
    applicationSettingsDataIsLoading ||
    hourlyBasedServiceIdsDataIsLoading ||
    serviceTypesDataIsLoading
  ) {
    return <ListLoadingSkeleton />;
  }

  if (
    applicationSettingsDataIsError ||
    hourlyBasedServiceIdsDataIsError ||
    serviceTypesDataIsError
  ) {
    notification.showNotification(
      'Es ist ein Fehler beim Laden der Daten aufgetreten.',
      'danger'
    );
    return router.back();
  }

  return (
    <BottomSheetModalProvider>
      <SafeAreaProvider>
        <SafeAreaView>
          <ScrollView className='h-full bg-white py-3'>
            <Controller
              name='service_provided_on'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <DateTimePickerModal
                    isVisible={showServiceProvidedOnDatePicker}
                    mode='date'
                    date={value}
                    display='inline'
                    onConfirm={handleServiceProvidedOnChange}
                    onCancel={() => setShowServiceProvidedOnDatePicker(false)}
                  />
                  <TextInput
                    className='px-3'
                    label='Datum'
                    value={value?.toLocaleDateString() ?? ''}
                    placeholder='Datum'
                    error={errors.service_provided_on?.message}
                    pressable={true}
                    onPress={() => setShowServiceProvidedOnDatePicker(true)}
                    onChangeText={(text) => onChange(text)}
                    onBlur={onBlur}
                    left={<Feather name='calendar' size={24} />}
                  />
                </>
              )}
            />

            <View className='h-4' />

            <Controller
              name='service_provided_started_at'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <DateTimePickerModal
                    isVisible={showServiceProvidedStartedAtDatePicker}
                    mode='time'
                    date={value || new Date()}
                    maximumDate={currentEnd}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    disabled={!isHourlyBasedService}
                    onConfirm={handleServiceProvidedStartedAtChange}
                    onCancel={() =>
                      setShowServiceProvidedStartedAtDatePicker(false)
                    }
                  />
                  <TextInput
                    className='px-3'
                    label='Start Uhrzeit'
                    value={
                      value
                        ? value.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''
                    }
                    placeholder='Start Uhrzeit'
                    error={errors.service_provided_started_at?.message}
                    disabled={!isHourlyBasedService}
                    pressable={true}
                    onPress={() =>
                      setShowServiceProvidedStartedAtDatePicker(true)
                    }
                    onChangeText={(text) => onChange(text)}
                    onBlur={onBlur}
                    left={<Feather name='clock' size={24} />}
                  />
                </>
              )}
            />

            <View className='h-4' />

            <Controller
              name='service_provided_ended_at'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <DateTimePickerModal
                    isVisible={showServiceProvidedEndedAtDatePicker}
                    mode='time'
                    date={value || new Date()}
                    minimumDate={currentStart}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    disabled={!isHourlyBasedService}
                    onConfirm={handleServiceProvidedEndedAtChange}
                    onCancel={() =>
                      setShowServiceProvidedEndedAtDatePicker(false)
                    }
                  />
                  <TextInput
                    className='px-3'
                    label='Ende Uhrzeit'
                    value={
                      value
                        ? value.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''
                    }
                    placeholder='Ende Uhrzeit'
                    error={errors.service_provided_ended_at?.message}
                    disabled={!isHourlyBasedService}
                    pressable={true}
                    onPress={() =>
                      setShowServiceProvidedEndedAtDatePicker(true)
                    }
                    onChangeText={(text) => onChange(text)}
                    onBlur={onBlur}
                    left={<Feather name='clock' size={24} />}
                  />
                </>
              )}
            />

            <View className='h-4' />
            <Divider className='h-0.5 bg-slate-200' />
            <View className='h-4' />

            <Controller
              name='service_id'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <SearchableSelectBottomSheetModal
                    options={services}
                    optionKey='id'
                    valueKey='text'
                    searchInputPlaceholder='Leistung suchen'
                    onSelect={handleVServiceChange}
                    modalRef={serviceSelectModalRef}
                  />
                  <TextInput
                    className='px-3'
                    label='Leistung'
                    value={value?.text ?? ''}
                    placeholder='Leistung'
                    error={errors.service_id?.message}
                    pressable={true}
                    onPress={() => openServiceSelectModal()}
                    onChangeText={(text) => onChange(text)}
                    onBlur={onBlur}
                    left={<Feather name='settings' size={24} />}
                  />
                </>
              )}
            />

            <View className='h-4' />

            <Controller
              name='amount'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className='px-3'
                  label='Menge'
                  value={value.toString()}
                  placeholder='Menge'
                  error={errors.amount?.message}
                  autoCapitalize='none'
                  autoComplete='off'
                  autoCorrect={false}
                  inputMode='numeric'
                  onChangeText={(text) => setValue('amount', text)}
                  onBlur={onBlur}
                  left={<Feather name='circle' size={24} />}
                />
              )}
            />

            <View className='h-4' />
            <Divider className='h-0.5 bg-slate-200' />
            <View className='h-4' />

            <Controller
              name='project_id'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <SearchableSelectBottomSheetModal
                    options={projects}
                    optionKey='id'
                    valueKey='text'
                    searchInputPlaceholder='Projekt suchen'
                    onSelect={handleProjectChange}
                    modalRef={projectSelectModalRef}
                  />
                  <TextInput
                    className='px-3'
                    label='Projekt'
                    value={value?.text ?? ''}
                    placeholder='Projekt'
                    error={errors.project_id?.message}
                    pressable={true}
                    onPress={() => openProjectSelectModal()}
                    onChangeText={(text) => onChange(text)}
                    onBlur={onBlur}
                    left={<Feather name='clipboard' size={24} />}
                  />
                </>
              )}
            />

            <View className='h-4' />

            <Controller
              name='comment'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className='px-3'
                  label='Bemerkungen'
                  value={value ?? ''}
                  placeholder='Bemerkungen'
                  error={errors.comment?.message}
                  multiline={true}
                  autoComplete='off'
                  onChangeText={(text) => onChange(text)}
                  onBlur={onBlur}
                  left={<Feather name='message-circle' size={24} />}
                />
              )}
            />

            <View className='h-10' />
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </BottomSheetModalProvider>
  );
});
