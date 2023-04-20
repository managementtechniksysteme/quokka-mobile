import {FlatList,} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {ListLoadingSkeleton} from '../../../components/lists/list-loading-skeleton';
import {ListItemSeparator} from '../../../components/lists/list-item-seperator';
import {Feather} from '@expo/vector-icons';
import {LogbookFilters, LogbookListEntry, useDestroyLogbookEntry, useGetLogbook,} from '../../../api/logbookEndpoint';
import {BottomSheetModal, BottomSheetModalProvider,} from '@gorhom/bottom-sheet';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {ListErrorState} from '../../../components/lists/list-error-state';
import {ListEmptyState} from '../../../components/lists/list-empty-state';
import * as Haptics from 'expo-haptics';
import {AnimatedFAB, IconButton,} from 'react-native-paper';
import {useNavigation, useRouter} from "expo-router";
import {LogbookFilterModal} from "../../../components/logbook/logbook-filter-modal";
import {LogbookDetailsModal} from "../../../components/logbook/logbook-details-modal";
import {LogbookActionsModal} from "../../../components/logbook/logbook-actions-modal";
import {LogbookListItem} from "../../../components/logbook/logbook-list-item";
import {undefined} from "zod";
import {DrawerToggleButton} from "@react-navigation/drawer";
import {useNotification} from "../../../context/notification";
import colors from "tailwindcss/colors";
import {useUser} from "../../../context/user";

export default function LogbookScreen() {
  const router = useRouter()
  const navigation = useNavigation();
  const {user} = useUser();
  const notification = useNotification();

  const [filters, setFilters] = useState<LogbookFilters>({
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
  } = useGetLogbook(filters);
  const destroyMutation = useDestroyLogbookEntry();

  const [modalData, setModalData] = useState<LogbookListEntry | null>(null);
  const [extendAddButton, setExtendAddButton] = useState(true);

  const logbookDetailsModalRef = useRef<BottomSheetModal>(null);
  const logbookFilterModalRef = useRef<BottomSheetModal>(null);
  const logbookActionsModalRef = useRef<BottomSheetModal>(null);

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

  const openDetailsModal = (item: LogbookListEntry) => {
    if (!item || !logbookDetailsModalRef.current) {
      return;
    }

    setModalData(item);
    logbookDetailsModalRef.current.present();
  };

  const openFilterModal = () => {
    logbookFilterModalRef.current?.present();
  };

  const filterLogbookEntries = (newFilters: LogbookFilters) => {
    setFilters(newFilters);
  };

  const openActionsModal = (item: LogbookListEntry) => {
    if (!item || !logbookActionsModalRef.current) {
      return;
    }

    Haptics.selectionAsync();

    setModalData(item);
    logbookActionsModalRef.current.present();
  };

  const editLogbookEntry = (item: LogbookListEntry) => {
    if (logbookActionsModalRef.current) {
      logbookActionsModalRef.current.close();
    }
    router.push(`/logbook/${item.id}`);
  };

  const destroyLogbookEntry = async (item: LogbookListEntry) => {
    destroyMutation.mutate(item.id);

    if (logbookActionsModalRef.current) {
      logbookActionsModalRef.current.close();
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
        <LogbookFilterModal
          logbookFilterModalRef={logbookFilterModalRef}
          initialFilters={filters}
          onDismiss={filterLogbookEntries}
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
                  <LogbookListItem
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
                label={'Eintragen'}
                extended={extendAddButton}
                visible={true}
                onPress={() => router.push('/logbook/create')}
                animateFrom='right'
                iconMode='dynamic'
              />
              <LogbookDetailsModal
                item={modalData}
                logbookDetailsModalRef={logbookDetailsModalRef}
              />
              <LogbookActionsModal
                item={modalData}
                logbookActionsModalRef={logbookActionsModalRef}
                onEditAction={editLogbookEntry}
                onDestroyAction={destroyLogbookEntry}
              />
            </SafeAreaView>
          </SafeAreaProvider>
        )}
      </BottomSheetModalProvider>
    </>
  );
}
