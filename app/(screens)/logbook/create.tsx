import {Button} from "react-native-paper";
import {useNavigation, useRouter} from "expo-router";
import {LogbookForm, LogbookFormApi, LogbookFormSchema} from "../../../components/logbook/logbook-form";
import {useGetProjectSelectOptions} from "../../../api/projectEndpoint";
import {useGetVehicleSelectOptions} from "../../../api/vehicleEndpoint";
import {ListErrorState} from "../../../components/lists/list-error-state";
import {LogbookMutableData, useCreateLogbookEntry, useGetLocationSelectOptions} from "../../../api/logbookEndpoint";
import * as React from "react";
import {useEffect, useRef} from "react";
import {HeaderBackButton} from "@react-navigation/elements";
import colors from "tailwindcss/colors";
import {ListLoadingSkeleton} from "../../../components/lists/list-loading-skeleton";
import {useNotification} from "../../../context/notification";
import {splitReturnTripLoogbookEntry} from "../../../utils/loogbook";
import {apiDate} from "../../../utils/dateTime";

export default function CreateLogbookScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const notification = useNotification();

  const formRef = useRef<LogbookFormApi>(null);

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

  const createMutation = useCreateLogbookEntry();
  const secondLegMutation  = useCreateLogbookEntry();

  const refetch = () => {
    projectDataIsError && projectDataRefetch();
    vehicleDataIsError && vehicleDataRefetch();
    locationDataError && locationDataRefetch();
  }

  useEffect(() => {
    navigation.getParent().setOptions({
      headerLeft: () => (<HeaderBackButton style={{marginLeft: 8}} onPress={() => router.back()} />)
    })
    if(projectData && vehicleData && locationData) {
      navigation.getParent().setOptions({
        headerRight: () => (
          <Button
            className='mr-2'
            textColor={colors.green['600']}
            onPress={() => formRef.current?.submit()}
            loading={createMutation.isLoading}
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
      litres_refuelled: data.litres_refuelled,
      origin: data.origin.text,
      destination: data.destination.text,
      project_id: data.project_id?.id || null,
      comment: data.comment,
    };

    if(data.is_return_trip) {
      const {first, second} = splitReturnTripLoogbookEntry(submitData);

      createMutation.mutate(first);
      secondLegMutation.mutate(second);
    } else {
      createMutation.mutate(submitData);
    }
  }

  useEffect(() => {
    if (createMutation.isSuccess) {
      notification.showNotification('Der Eintrag wurde angelegt.', 'success');
      router.push('/logbook');
    } else if (createMutation.isError) {
      notification.showNotification('Fehler beim Anlegen des Eintrages.', 'danger');
      formRef.current?.setErrors(createMutation.error.errors)
    }
  }, [createMutation.isSuccess, createMutation.isError]);

  if(projectDataIsLoading || vehicleDataIsLoading || locationDataIsLoading) {
    return (<ListLoadingSkeleton />);
  }

  if(projectDataIsError || vehicleDataIsError || locationDataIsError) {
    return <ListErrorState onRefetch={refetch} />;
  }

  if(projectData && vehicleData && locationData) {
    return (
      <LogbookForm ref={formRef} vehicles={vehicleData.data} projects={projectData.data} locations={locationData.data} onSubmit={onSubmit} />
    )
  }

}