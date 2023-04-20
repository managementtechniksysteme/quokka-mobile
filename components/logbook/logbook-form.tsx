import { Pressable, ScrollView, Text, View } from 'react-native';
import { SelectOption, SelectOptionDataSchema } from '../../api/config/config';
import { undefined, z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Divider, Switch } from 'react-native-paper';
import React, {
  forwardRef,
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
import colors from 'tailwindcss/colors';

const LogbookFormSchema = z
  .object({
    vehicle_id: SelectOptionDataSchema,
    driven_on: z.date(),
    start_kilometres: z.coerce
      .number()
      .positive()
      .multipleOf(1)
      .or(z.literal('0')),
    end_kilometres: z.coerce.number().positive().multipleOf(1),
    driven_kilometres: z.coerce.number().positive().multipleOf(1),
    litres_refuelled: z.coerce
      .number()
      .positive()
      .multipleOf(1)
      .or(z.literal(''))
      .or(z.null()),
    origin: SelectOptionDataSchema,
    destination: SelectOptionDataSchema,
    project_id: SelectOptionDataSchema.optional().nullable(),
    comment: z.string().nullable(),
    is_return_trip: z.boolean(),
  })
  .refine((data) => data.start_kilometres < data.end_kilometres, {
    path: ['start_kilometres'],
    message: 'Die Start Kilometer müssen kleiner als die Ende Kilometer sein.',
  })
  .refine((data) => data.end_kilometres > data.start_kilometres, {
    path: ['end_kilometres'],
    message: 'Die Ende Kilometer müssen größer als die Start Kilometer sein',
  })
  .refine(
    (data) =>
      data.start_kilometres === data.end_kilometres - data.driven_kilometres,
    {
      path: ['start_kilometres'],
      message:
        'Die Start Kilometer müssen der Differenz aus Ende Kilometer und gefahrenen Kilometern entsprechen',
    }
  )
  .refine(
    (data) =>
      data.end_kilometres === data.start_kilometres + data.driven_kilometres,
    {
      path: ['end_kilometres'],
      message:
        'Die Ende Kilometer müssen der Summe aus Start Kilometer und gefahrenen Kilometern entspreche',
    }
  )
  .refine(
    (data) =>
      data.driven_kilometres === data.end_kilometres - data.start_kilometres,
    {
      path: ['driven_kilometres'],
      message:
        'Die gefahrenen Kilometer müssen der Differenz aus Ende Kilometer und Start Kilometer entsprechen',
    }
  );

export type LogbookFormSchema = z.infer<typeof LogbookFormSchema>;

export type LogbookFormProps = {
  logbook?: LogbookFormSchema | undefined;
  projects: SelectOption[];
  vehicles: SelectOption[];
  locations: SelectOption[];
  onSubmit: (data: LogbookFormSchema, id?: number) => void;
};

export type LogbookFormApi = {
  submit: () => void;
  setErrors: (errors: Record<string, string>) => void;
};

export const LogbookForm = forwardRef<LogbookFormApi, LogbookFormProps>(
  ({ logbook, projects, vehicles, locations, onSubmit }, ref) => {
    const projectSelectModalRef = useRef<BottomSheetModal>(null);
    const vehicleSelectModalRef = useRef<BottomSheetModal>(null);
    const originSelectModalRef = useRef<BottomSheetModal>(null);
    const destinationSelectModalRef = useRef<BottomSheetModal>(null);

    const [showDrivenOnDatePicker, setShowDrivenOnDatePicker] = useState(false);

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

    const openOriginSelectModal = () => {
      originSelectModalRef.current?.present();
    };

    const closeOriginSelectModal = () => {
      originSelectModalRef.current?.close();
    };

    const openDestinationSelectModal = () => {
      destinationSelectModalRef.current?.present();
    };

    const closeDestinationSelectModal = () => {
      destinationSelectModalRef.current?.close();
    };

    const handleDrivenOnChange = (drivenOn: Date) => {
      setShowDrivenOnDatePicker(false);
      setValue('driven_on', drivenOn);
    };

    const handleProjectChange = (project?: SelectOption) => {
      closeProjectSelectModal();
      setValue('project_id', project || null);
    };

    const handleVehicleChange = (vehicle: SelectOption) => {
      closeVehicleSelectModal();
      setValue('vehicle_id', vehicle);
    };

    const handleOriginChange = (origin: SelectOption) => {
      closeOriginSelectModal();
      setValue('origin', origin);
    };

    const handleDestinationChange = (destination: SelectOption) => {
      closeDestinationSelectModal();
      setValue('destination', destination);
    };

    const {
      control,
      handleSubmit,
      setValue,
      setError,
      formState: { errors, isSubmitting },
    } = useForm<LogbookFormSchema>({
      reValidateMode: 'onSubmit',
      resolver: zodResolver(LogbookFormSchema),
      defaultValues: {
        vehicle_id: logbook?.vehicle_id || null,
        driven_on: logbook?.driven_on || new Date(),
        start_kilometres: logbook?.start_kilometres || '',
        end_kilometres: logbook?.end_kilometres || '',
        driven_kilometres: logbook?.driven_kilometres || '',
        litres_refuelled: logbook?.litres_refuelled || '',
        origin: logbook?.origin || null,
        destination: logbook?.destination || null,
        project_id: logbook?.project_id || null,
        comment: logbook?.comment || '',
        is_return_trip: false,
      },
    });

    const submitRef = useRef(handleSubmit);
    submitRef.current = handleSubmit;

    const setErrorRef = useRef(setError);
    setErrorRef.current = setError;

    useImperativeHandle(
      ref,
      () => {
        return {
          submit: handleSubmit(onSubmit),
          setErrors: (data) => setServerErrors(data, setError),
        };
      },
      []
    );

    return (
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <SafeAreaView>
            <ScrollView className='h-full bg-white py-3'>
              <Controller
                name='vehicle_id'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <SearchableSelectBottomSheetModal
                      options={vehicles}
                      optionKey='id'
                      valueKey='text'
                      searchInputPlaceholder='Fahrzeug suchen'
                      onSelect={handleVehicleChange}
                      modalRef={vehicleSelectModalRef}
                    />
                    <TextInput
                      className='px-3'
                      label='Fahrzeug'
                      value={value?.text ?? ''}
                      placeholder='Fahrzeug'
                      error={errors.vehicle_id?.message}
                      pressable={true}
                      onPress={() => openVehicleSelectModal()}
                      onChangeText={(text) => onChange(text)}
                      onBlur={onBlur}
                      left={<Feather name='truck' size={24} />}
                    />
                  </>
                )}
              />

              <View className='h-4' />

              <Controller
                name='driven_on'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <DateTimePickerModal
                      isVisible={showDrivenOnDatePicker}
                      mode='date'
                      date={value}
                      display='inline'
                      onConfirm={handleDrivenOnChange}
                      onCancel={() => setShowDrivenOnDatePicker(false)}
                    />
                    <TextInput
                      className='px-3'
                      label='Datum'
                      value={value?.toLocaleDateString() ?? ''}
                      placeholder='Datum'
                      error={errors.driven_on?.message}
                      pressable={true}
                      onPress={() => setShowDrivenOnDatePicker(true)}
                      onChangeText={(text) => onChange(text)}
                      onBlur={onBlur}
                      left={<Feather name='calendar' size={24} />}
                    />
                  </>
                )}
              />

              <View className='h-4' />
              <Divider className='h-0.5 bg-slate-200' />
              <View className='h-4' />

              <Controller
                name='start_kilometres'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className='px-3'
                    label='Start Kilometer'
                    value={value.toString()}
                    placeholder='Start Kilometer'
                    error={errors.start_kilometres?.message}
                    autoCapitalize='none'
                    autoComplete='off'
                    autoCorrect={false}
                    inputMode='numeric'
                    onChangeText={(text) => onChange(text)}
                    onBlur={onBlur}
                    left={<Feather name='play' size={24} />}
                  />
                )}
              />

              <View className='h-4' />

              <Controller
                name='end_kilometres'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className='px-3'
                    label='Ende Kilometer'
                    value={value.toString()}
                    placeholder='Ende Kilometer'
                    error={errors.end_kilometres?.message}
                    autoCapitalize='none'
                    autoComplete='off'
                    autoCorrect={false}
                    inputMode='numeric'
                    onChangeText={(text) => onChange(text)}
                    onBlur={onBlur}
                    left={<Feather name='square' size={24} />}
                  />
                )}
              />

              <View className='h-4' />

              <Controller
                name='driven_kilometres'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className='px-3'
                    label='gefahrene Kilometer'
                    value={value.toString()}
                    placeholder='gefahrene Kilometer'
                    error={errors.driven_kilometres?.message}
                    autoCapitalize='none'
                    autoComplete='off'
                    autoCorrect={false}
                    inputMode='numeric'
                    onChangeText={(text) => onChange(text)}
                    onBlur={onBlur}
                    left={<Feather name='circle' size={24} />}
                  />
                )}
              />

              <View className='h-4' />

              <Controller
                name='litres_refuelled'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className='px-3'
                    label='getankte Liter'
                    value={value?.toString()}
                    placeholder='getankte Liter'
                    error={errors.litres_refuelled?.message}
                    autoCapitalize='none'
                    autoComplete='off'
                    autoCorrect={false}
                    inputMode='numeric'
                    onChangeText={(text) => onChange(text)}
                    onBlur={onBlur}
                    left={<Feather name='droplet' size={24} />}
                  />
                )}
              />

              <View className='h-4' />
              <Divider className='h-0.5 bg-slate-200' />
              <View className='h-4' />

              <Controller
                name='origin'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <SearchableSelectBottomSheetModal
                      options={locations}
                      optionKey='id'
                      valueKey='text'
                      creatable={true}
                      searchInputPlaceholder='Ort suchen'
                      onSelect={handleOriginChange}
                      modalRef={originSelectModalRef}
                    />
                    <TextInput
                      className='px-3'
                      label='Start'
                      value={value?.text ?? ''}
                      placeholder='Start'
                      error={errors.origin?.message}
                      pressable={true}
                      onPress={() => openOriginSelectModal()}
                      onChangeText={(text) => onChange(text)}
                      onBlur={onBlur}
                      left={<Feather name='map-pin' size={24} />}
                      right={
                        <Pressable onPress={() => handleOriginChange(null)}>
                          <Feather
                            color={colors.slate['400']}
                            name='x'
                            size={24}
                          />
                        </Pressable>
                      }
                    />
                  </>
                )}
              />

              <View className='h-4' />

              <Controller
                name='destination'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <SearchableSelectBottomSheetModal
                      options={locations}
                      optionKey='id'
                      valueKey='text'
                      creatable={true}
                      searchInputPlaceholder='Ort suchen'
                      onSelect={handleDestinationChange}
                      modalRef={destinationSelectModalRef}
                    />
                    <TextInput
                      className='px-3'
                      label='Ziel'
                      value={value?.text ?? ''}
                      placeholder='Ziel'
                      error={errors.destination?.message}
                      pressable={true}
                      onPress={() => openDestinationSelectModal()}
                      onChangeText={(text) => onChange(text)}
                      onBlur={onBlur}
                      left={<Feather name='map-pin' size={24} />}
                      right={
                        <Pressable
                          onPress={() => handleDestinationChange(null)}
                        >
                          <Feather
                            color={colors.slate['400']}
                            name='x'
                            size={24}
                          />
                        </Pressable>
                      }
                    />
                  </>
                )}
              />

              <View className='h-4' />

              {!logbook && (
                <Controller
                  name='is_return_trip'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <View className='px-3'>
                      <View className='flex-row items-center gap-2'>
                        <Switch
                          value={value}
                          onValueChange={(value) =>
                            setValue('is_return_trip', value)
                          }
                        />
                        <Text className='text-lg text-slate-700'>
                          Hin- und Rückfahrt?
                        </Text>
                      </View>
                      <Text className='text-md mt-2 leading-5 tracking-wide text-slate-500'>
                        Bei Aktivierung dieser Aktion werden automatisch zwei
                        Fahrten mit halbierten Distanzen gespeichert. Getankte
                        Liter werden bei der ersten Fahrt vermerkt.
                      </Text>
                    </View>
                  )}
                />
              )}

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
                      right={
                        <Pressable onPress={() => handleProjectChange(null)}>
                          <Feather
                            color={colors.slate['400']}
                            name='x'
                            size={24}
                          />
                        </Pressable>
                      }
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
  }
);
