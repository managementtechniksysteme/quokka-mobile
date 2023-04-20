import {Button} from "react-native-paper";
import {useNavigation, useRouter, useSearchParams} from "expo-router";
import {LogbookForm, LogbookFormApi, LogbookFormSchema} from "../../../components/logbook/logbook-form";
import {useGetProjectSelectOptions} from "../../../api/projectEndpoint";
import {useGetVehicleSelectOptions} from "../../../api/vehicleEndpoint";
import {ListErrorState} from "../../../components/lists/list-error-state";
import {
  LogbookMutableData,
  useGetLocationSelectOptions,
  useGetLogbookEntry,
  useUpdateLogbookEntry
} from "../../../api/logbookEndpoint";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {HeaderBackButton} from "@react-navigation/elements";
import colors from "tailwindcss/colors";
import {ListLoadingSkeleton} from "../../../components/lists/list-loading-skeleton";
import {useNotification} from "../../../context/notification";
import {apiDate} from "../../../utils/dateTime";

export default function EditLogbookScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const notification = useNotification()

  const { edit: id } = useSearchParams();

  const formRef = useRef<LogbookFormApi>(null);

  const [formData, setFormData] = useState<LogbookFormSchema|null>(null)

  const {
    isLoading: projectDataIsLoading,
    isError: projectDataIsError,
    data: projectData,
    error: projectDataError,
    refetch: projectDataRefetch,
  } = useGetProjectSelectOptions();
  const {
    isLoading: vehicleDataIsLoading,
    isError: vehicleDataIsError,
    data: vehicleData,
    error: vehicleDataError,
    refetch: vehicleDataRefetch,
  } = useGetVehicleSelectOptions();
  const {
    isLoading: locationDataIsLoading,
    isError: locationDataIsError,
    data: locationData,
    error: locationDataError,
    refetch: locationDataRefetch,
  } = useGetLocationSelectOptions();
  const {
    isLoading: logbookDataIsLoading,
    isError: logbookDataIsError,
    data: logbookData,
    error: logbookDataError,
    refetch: logbookDataRefetch,
  } = useGetLogbookEntry(Number(id));

  const updateMutation = useUpdateLogbookEntry();

  const refetch = () => {
    projectDataIsError && projectDataRefetch();
    vehicleDataIsError && vehicleDataRefetch();
    locationDataError && locationDataRefetch();
    logbookDataError && logbookDataRefetch();
  }

  useEffect(() => {
    navigation.getParent().setOptions({
      headerLeft: () => (
        <HeaderBackButton style={{marginLeft: 8}} onPress={() => router.back()} />
      )
    })
    if(projectData && vehicleData && locationData) {
      navigation.getParent().setOptions({
        headerRight: () => (
          <Button
            className='mr-2'
            textColor={colors.green['600']}
            onPress={() => formRef.current?.submit()}
            loading={updateMutation.isLoading}
          >
            Speichern
          </Button>
        )
      })
    }
  })

  const onSubmit = (data: LogbookFormSchema) => {
    const submitData: LogbookMutableData = {
      vehicle_id: data.vehicle_id.id,
      driven_on: apiDate(data.driven_on),
      start_kilometres: data.start_kilometres,
      end_kilometres: data.end_kilometres,
      driven_kilometres: data.driven_kilometres,
      litres_refuelled: data.litres_refuelled || null,
      origin: data.origin.text,
      destination: data.destination.text,
      project_id: data.project_id?.id || null,
      comment: data.comment,
    };

    updateMutation.mutate({id: logbookData.data.id, data: submitData});
  }

  useEffect(() => {
    if (updateMutation.isSuccess) {
      notification.showNotification('Der Eintrag wurde bearbeitet.', 'success');
      router.push('/logbook');
    } else if (updateMutation.isError) {
      notification.showNotification('Fehler beim Bearbeiten des Eintrages.', 'danger');
      formRef.current?.setErrors(updateMutation.error.errors)
    }
  }, [updateMutation.isSuccess, updateMutation.isError]);

  useEffect(() => {
    if(projectData && vehicleData && locationData && logbookData) {
      const vehicle = vehicleData.data.find(vehicle => vehicle.id === logbookData.data.vehicle_id)
      const origin = locationData.data.find(location => location.text === logbookData.data.origin)
      const destination = locationData.data.find(location => location.text === logbookData.data.destination)
      const project = projectData.data.find(project => project.id === logbookData.data.project_id)

      setFormData({
        vehicle_id: {id: vehicle.id, text: vehicle.text},
        driven_on: new Date(logbookData.data.driven_on),
        start_kilometres: logbookData.data.start_kilometres,
        end_kilometres: logbookData.data.end_kilometres,
        driven_kilometres: logbookData.data.driven_kilometres,
        litres_refuelled: logbookData.data.litres_refuelled,
        origin: {id: origin.id, text: origin.text},
        destination: {id: destination.id, text: destination.text},
        project_id: project ? {id: project.id, text: project.text} : null,
        comment: logbookData.data.comment,
        is_return_trip: false,
      })
    }
  }, [projectData, vehicleData, locationData, logbookData])

  if(projectDataIsLoading || vehicleDataIsLoading || locationDataIsLoading || logbookDataIsLoading || !formData) {
    return (<ListLoadingSkeleton />);
  }

  if(projectDataIsError || vehicleDataIsError || locationDataIsError || logbookDataIsError) {
    return <ListErrorState onRefetch={refetch} />;
  }

  if(projectData && vehicleData && locationData && logbookData && formData) {
    return (
      <LogbookForm ref={formRef} logbook={formData} vehicles={vehicleData.data} projects={projectData.data} locations={locationData.data} onSubmit={onSubmit} />
    )
  }

}