import {FlatList,} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {ListLoadingSkeleton} from '../../../components/lists/list-loading-skeleton';
import {ListItemSeparator} from '../../../components/lists/list-item-seperator';
import {Feather} from '@expo/vector-icons';
import {
  AccountingFilters,
  AccountingListEntry,
  useDestroyAccountingEntry,
  useGetAccounting,
} from '../../../api/accountingEndpoint';
import {BottomSheetModal, BottomSheetModalProvider,} from '@gorhom/bottom-sheet';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {ListErrorState} from '../../../components/lists/list-error-state';
import {ListEmptyState} from '../../../components/lists/list-empty-state';
import * as Haptics from 'expo-haptics';
import {AnimatedFAB, IconButton} from 'react-native-paper';
import {AccountingDetailsModal} from "../../../components/accounting/accounting-details-modal";
import {AccountingActionsModal} from "../../../components/accounting/accounting-actions-modal";
import {AccountingListItem} from "../../../components/accounting/accounting-list-item";
import {useNotification} from "../../../context/notification";
import {useNavigation, useRouter} from "expo-router";
import {DrawerToggleButton} from "@react-navigation/drawer";
import {undefined} from "zod";
import {AccountingFilterModal} from "../../../components/accounting/acounting-filter-modal";
import colors from "tailwindcss/colors";
import {useUser} from "../../../context/user";

export default function AccountingScreen() {
  const router = useRouter()
  const navigation = useNavigation();
  const {user} = useUser();
  const notification = useNotification();

  const [filters, setFilters] = useState<AccountingFilters>({
    start: new Date((new Date()).getTime() - 1000 * 60 * 60 * 24 * user.settings.accounting_filter_default_days),
    show_only_own: true,
  });

  const {
    isLoading,
    isError,
    isRefetching,
    data,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useGetAccounting(filters);

  const destroyMutation = useDestroyAccountingEntry();

  const [modalData, setModalData] = useState<AccountingListEntry | null>(null);
  const [extendAddButton, setExtendAddButton] = useState(true);

  const accountingDetailsModalRef = useRef<BottomSheetModal>(null);
  const accountingFilterModalRef = useRef<BottomSheetModal>(null);
  const accountingActionsModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    navigation.getParent().setOptions({
      headerLeft: () => (<DrawerToggleButton />)
    });
    if(data) {
      navigation.getParent().setOptions({
        headerRight: () => (
          <IconButton
            className='mr-2'
            iconColor={colors.slate['700']}
            icon={() => <Feather name='filter' />}
            size={28}
            onPress={() => openFilterModal()}
          />
        )
      });
    }
  })

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      navigation.getParent().setOptions({
        headerRight: () => undefined,
      })
    });

    return unsubscribe;
  }, [])

  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const openDetailsModal = (item: AccountingListEntry) => {
    if (!item || !accountingDetailsModalRef.current) {
      return;
    }

    setModalData(item);
    accountingDetailsModalRef.current.present();
  };

  const openFilterModal = () => {
    accountingFilterModalRef.current?.present();
  };

  const filterAccountingEntries = (newFilters: AccountingFilters) => {
    setFilters(newFilters);
  };

  const openActionsModal = (item: AccountingListEntry) => {
    if (!item || !accountingActionsModalRef.current) {
      return;
    }

    Haptics.selectionAsync();

    setModalData(item);
    accountingActionsModalRef.current.present();
  };

  const editAccountingEntry = (item: AccountingListEntry) => {
    if (accountingActionsModalRef.current) {
      accountingActionsModalRef.current.close();
    }
    router.push(`/accounting/${item.id}`);
  };

  const destroyAccountingEntry = async (item: AccountingListEntry) => {
    destroyMutation.mutate(item.id);

    if (accountingActionsModalRef.current) {
      accountingActionsModalRef.current.close();
    }
  };

  useEffect(() => {
    if (destroyMutation.isSuccess) {
      notification.showNotification('Der Eintrag wurde entfernt.', 'success');
    } else if (destroyMutation.isError) {
      notification.showNotification('Fehler beim Entfernen des Eintrages.', 'danger');
    }
  }, [destroyMutation.isSuccess, destroyMutation.isError]);

  return (
    <>
      <BottomSheetModalProvider>
        <AccountingFilterModal
          accountingFilterModalRef={accountingFilterModalRef}
          initialFilters={filters}
          onDismiss={filterAccountingEntries}
        />

        {(isLoading || (isError && isRefetching)) && <ListLoadingSkeleton />}

        {(isError) && <ListErrorState onRefetch={refetch} />}

        {data && (
          <SafeAreaProvider>
            <SafeAreaView>
              <FlatList
                className='h-full'
                data={data.pages.map((page) => page.data).flat()}
                renderItem={({ item }) => (
                  <AccountingListItem
                    item={item}
                    onPress={() => openDetailsModal(item)}
                    onLongPress={() => openActionsModal(item)}
                  />
                )}
                ListEmptyComponent={ListEmptyState}
                ItemSeparatorComponent={ListItemSeparator}
                keyExtractor={(item, index) => index.toString()}
                refreshing={isRefetching}
                onRefresh={refetch}
                onEndReached={loadNextPage}
                onEndReachedThreshold={0.5}
                onScroll={(event) =>
                  setExtendAddButton(event.nativeEvent.contentOffset.y <= 0)
                }
              />
              <AnimatedFAB
                className='ios:bottom-12 ios:right-4 absolute bottom-4 right-4'
                icon={() => <Feather name='plus' size={20} />}
                label={'Abrechnen'}
                extended={extendAddButton}
                visible={true}
                onPress={() => router.push('/accounting/create')}
                animateFrom='right'
                iconMode='dynamic'
              />
              <AccountingDetailsModal
                item={modalData}
                accountingDetailsModalRef={accountingDetailsModalRef}
              />
              <AccountingActionsModal
                item={modalData}
                accountingActionsModalRef={accountingActionsModalRef}
                onEditAction={editAccountingEntry}
                onDestroyAction={destroyAccountingEntry}
              />
            </SafeAreaView>
          </SafeAreaProvider>
        )}
      </BottomSheetModalProvider>
    </>
  );
}
