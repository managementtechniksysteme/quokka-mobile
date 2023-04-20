import {Button} from "react-native-paper";
import {useNavigation, useRouter} from "expo-router";
import {useGetProjectSelectOptions} from "../../../api/projectEndpoint";
import {ListErrorState} from "../../../components/lists/list-error-state";
import {LogbookMutableData} from "../../../api/logbookEndpoint";
import * as React from "react";
import {useEffect, useRef} from "react";
import {HeaderBackButton} from "@react-navigation/elements";
import colors from "tailwindcss/colors";
import {ListLoadingSkeleton} from "../../../components/lists/list-loading-skeleton";
import {useNotification} from "../../../context/notification";
import {apiDate, apiTime} from "../../../utils/dateTime";
import {useGetServiceSelectOptions} from "../../../api/serviceEndpoint";
import {useCreateAccountingEntry} from "../../../api/accountingEndpoint";
import {AccountingForm, AccountingFormApi, AccountingFormSchema} from "../../../components/accounting/accounting-form";

export default function CreateAccountingScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const notification = useNotification();

  const formRef = useRef<AccountingFormApi>(null);

  const {
    isLoading: projectDataIsLoading,
    isError: projectDataIsError,
    data: projectData,
    error: projectDataError,
    refetch: projectDataRefetch,
  } = useGetProjectSelectOptions();
  const {
    isLoading: serviceDataIsLoading,
    isError: serviceDataIsError,
    data: serviceData,
    error: serviceDataError,
    refetch: serviceDataRefetch,
  } = useGetServiceSelectOptions();

  const createMutation = useCreateAccountingEntry();

  const refetch = () => {
    projectDataIsError && projectDataRefetch();
    serviceDataIsError && serviceDataRefetch();
  }

  useEffect(() => {
    navigation.getParent().setOptions({
      headerLeft: () => (<HeaderBackButton style={{marginLeft: 8}} onPress={() => router.back()} />)
    })
    if(projectData && serviceData) {
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

  const onSubmit = (data: AccountingFormSchema) => {
    const submitData: LogbookMutableData = {
      service_provided_on: apiDate(data.service_provided_on),
      service_provided_started_at: apiTime(data.service_provided_started_at),
      service_provided_ended_at: apiTime(data.service_provided_ended_at),
      amount: data.amount,
      comment: data.comment,
      project_id: data.project_id?.id || null,
      service_id: data.service_id?.id || null,
    };

    createMutation.mutate(submitData);
  }

  useEffect(() => {
    if (createMutation.isSuccess) {
      notification.showNotification('Der Eintrag wurde angelegt.', 'success');
      router.push('/accounting');
    } else if (createMutation.isError) {
      notification.showNotification('Fehler beim Anlegen des Eintrages.', 'danger');
      formRef.current?.setErrors(createMutation.error.errors)
    }
  }, [createMutation.isSuccess, createMutation.isError]);

  if(projectDataIsLoading || serviceDataIsLoading) {
    return (<ListLoadingSkeleton />);
  }

  if(projectDataIsError || serviceDataIsError) {
    return <ListErrorState onRefetch={refetch} />;
  }

  if(projectData && serviceData) {
    return (
      <AccountingForm ref={formRef} services={serviceData.data} projects={projectData.data} onSubmit={onSubmit} />
    )
  }

}