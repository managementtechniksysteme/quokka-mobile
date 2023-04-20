import {Button} from "react-native-paper";
import {useNavigation, useRouter, useSearchParams} from "expo-router";
import {useGetProjectSelectOptions} from "../../../api/projectEndpoint";
import {ListErrorState} from "../../../components/lists/list-error-state";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {HeaderBackButton} from "@react-navigation/elements";
import colors from "tailwindcss/colors";
import {ListLoadingSkeleton} from "../../../components/lists/list-loading-skeleton";
import {useNotification} from "../../../context/notification";
import {apiDate} from "../../../utils/dateTime";
import {useGetServiceSelectOptions} from "../../../api/serviceEndpoint";
import {AccountingMutableData, useGetAccountingEntry, useUpdateAccountingEntry} from "../../../api/accountingEndpoint";
import {AccountingForm, AccountingFormApi, AccountingFormSchema} from "../../../components/accounting/accounting-form";

export default function EditAccountingScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const notification = useNotification()

  const { edit: id } = useSearchParams();

  const formRef = useRef<AccountingFormApi>(null);

  const [formData, setFormData] = useState<AccountingFormSchema|null>(null)

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
  const {
    isLoading: accountingDataIsLoading,
    isError: accountingDataIsError,
    data: accountingData,
    error: accountingDataError,
    refetch: accountingDataRefetch,
  } = useGetAccountingEntry(Number(id));

  const updateMutation = useUpdateAccountingEntry();

  const refetch = () => {
    projectDataIsError && projectDataRefetch();
    serviceDataIsError && serviceDataRefetch();
    accountingDataError && accountingDataRefetch();
  }

  useEffect(() => {
    navigation.getParent().setOptions({
      headerLeft: () => (
        <HeaderBackButton style={{marginLeft: 8}} onPress={() => router.back()} />
      )
    })
    if(projectData && serviceData) {
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

  const onSubmit = (data: AccountingFormSchema) => {
    const submitData: AccountingMutableData = {
      service_provided_on: apiDate(data.service_provided_on),
      service_provided_started_at: apiTime(data.service_provided_started_at),
      service_provided_ended_at: apiTime(data.service_provided_ended_at),
      amount: data.amount,
      comment: data.comment,
      project_id: data.project_id?.id || null,
      service_id: data.service_id?.id || null,
    };

    updateMutation.mutate({id: accountingData.data.id, data: submitData});
  }

  useEffect(() => {
    if (updateMutation.isSuccess) {
      notification.showNotification('Der Eintrag wurde bearbeitet.', 'success');
      router.push('/accounting');
    } else if (updateMutation.isError) {
      notification.showNotification('Fehler beim Bearbeiten des Eintrages.', 'danger');
      formRef.current?.setErrors(updateMutation.error.errors)
    }
  }, [updateMutation.isSuccess, updateMutation.isError]);

  useEffect(() => {
    if(projectData && serviceData && accountingData) {
      const service = serviceData.data.find(service => service.id === accountingData.data.service_id)
      const project = projectData.data.find(project => project.id === accountingData.data.project_id)

      setFormData({
        service_provided_on: new Date(accountingData.data.service_provided_on),
        service_provided_started_at: accountingData.data.service_provided_started_at,
        service_provided_ended_at: accountingData.data.service_provided_ended_at,
        amount: accountingData.data.amount,
        comment: accountingData.data.comment,
        project_id: project ? {id: project.id, text: project.text} : null,
        service_id: service ? {id: service.id, text: service.text} : null,
      })
    }
  }, [projectData, serviceData, accountingData])

  if(projectDataIsLoading || serviceDataIsLoading || accountingDataIsLoading || !formData) {
    return (<ListLoadingSkeleton />);
  }

  if(projectDataIsError || serviceDataIsError || accountingDataIsError) {
    return <ListErrorState onRefetch={refetch} />;
  }

  if(projectData && serviceData && accountingData && formData) {
    return (
      <AccountingForm ref={formRef} accounting={formData} services={serviceData.data} projects={projectData.data} onSubmit={onSubmit} />
    )
  }

}