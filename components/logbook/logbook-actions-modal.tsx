import * as React from 'react';
import { RefObject } from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { LogbookListEntry } from '../../api/logbookEndpoint';
import { Pressable, Text, View } from 'react-native';
import { CustomBottomSheetBackdrop } from '../sheets/bottom-sheet-backdrop';
import { Feather } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import colors from 'tailwindcss/colors';
import { useUser } from '../../context/user';

export type LogbookActionsModalProps = {
  logbookActionsModalRef: RefObject<BottomSheetModal>;
  item: LogbookListEntry;
  onEditAction: (item: LogbookListEntry) => void;
  onDestroyAction: (item: LogbookListEntry) => void;
};

export const LogbookActionsModal = ({
  logbookActionsModalRef,
  item,
  onEditAction,
  onDestroyAction,
}: LogbookActionsModalProps) => {
  const { user, cannot } = useUser();

  return (
    <View className='flex'>
      <BottomSheetModal
        ref={logbookActionsModalRef}
        snapPoints={['22%']}
        backdropComponent={CustomBottomSheetBackdrop}
      >
        <BottomSheetView>
          {item && (
            <View className='px-5'>
              <View className='mb-3 flex-row justify-between border-b border-slate-200 pb-1'>
                <Text className='text-xl tracking-wide'>Aktionen</Text>
                <Pressable
                  className='self-center'
                  onPress={() => logbookActionsModalRef?.current?.close()}
                >
                  <Text>
                    <Feather name='x' size={24} />
                  </Text>
                </Pressable>
              </View>
              <View className='flex-col'>
                <Button
                  icon={({ size, color }) => (
                    <Feather name='edit' size={size} color={color} />
                  )}
                  textColor={colors.slate['700']}
                  labelStyle={{ fontSize: 18 }}
                  mode='text'
                  disabled={
                    (item.employee_id === user.id &&
                      cannot('logbook.update.own')) ||
                    (item.employee_id !== user.id &&
                      cannot('logbook.update.other'))
                  }
                  onPress={() => {
                    item && onEditAction(item);
                  }}
                >
                  Fahrt bearbeiten
                </Button>
                <Button
                  className='mt-3'
                  icon={({ size, color }) => (
                    <Feather name='trash-2' size={size} color={color} />
                  )}
                  textColor={colors.red['600']}
                  labelStyle={{ fontSize: 18 }}
                  mode='text'
                  disabled={
                    (item.employee_id === user.id &&
                      cannot('logbook.delete.own')) ||
                    (item.employee_id !== user.id &&
                      cannot('logbook.delete.other'))
                  }
                  onPress={() => {
                    item && onDestroyAction(item);
                  }}
                >
                  Fahrt entfernen
                </Button>
              </View>
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};
