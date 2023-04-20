import * as React from 'react';
import { RefObject } from 'react';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { LogbookListEntry } from '../../api/logbookEndpoint';
import { Text, View } from 'react-native';
import { CustomBottomSheetBackdrop } from '../sheets/bottom-sheet-backdrop';
import { BottomSheetScrollViewStickyHeader } from '../sheets/bottom-sheet-scroll-view-sticky-header';
import { Feather } from '@expo/vector-icons';

export type LogbookDetailsModalProps = {
  logbookDetailsModalRef: RefObject<BottomSheetModal>;
  item: LogbookListEntry | null;
};

export const LogbookDetailsModal = ({
  logbookDetailsModalRef,
  item,
}: LogbookDetailsModalProps) => {
  return (
    <View className='flex'>
      <BottomSheetModal
        ref={logbookDetailsModalRef}
        snapPoints={['30%', '50%']}
        backdropComponent={CustomBottomSheetBackdrop}
      >
        <BottomSheetScrollView
          className='flex h-full'
          bounces={false}
          stickyHeaderIndices={[0]}
        >
          {item && (
            <BottomSheetScrollViewStickyHeader
              onClose={() => logbookDetailsModalRef?.current?.close()}
            />
          )}
          {item && (
            <View className='px-5'>
              <View className='flex-row gap-2'>
                <View className='flex-row'>
                  <Text className='mr-0.5 self-center text-slate-500'>
                    <Feather name='calendar' />
                  </Text>
                  <Text className='text-slate-500'>
                    {item.driven_on.toLocaleDateString([], {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </Text>
                </View>
                <View className='flex-row'>
                  <Text className='mr-0.5 self-center text-slate-500'>
                    <Feather name='book' />
                  </Text>
                  <Text className='text-slate-500'>
                    {item.driven_kilometres.toLocaleString()} km
                  </Text>
                </View>
                {item.litres_refuelled && (
                  <View className='flex-row'>
                    <Text className='mr-0.5 self-center text-slate-500'>
                      <Feather name='droplet' />
                    </Text>
                    <Text className='text-slate-500'>
                      {item.litres_refuelled.toLocaleString()} Liter
                    </Text>
                  </View>
                )}
              </View>
              <View className='mt-1'>
                <View className='flex-row'>
                  <Text className='text-lg tracking-wide'>{item.origin}</Text>
                  <Text className='mx-1 self-center text-lg text-slate-500'>
                    <Feather name='arrow-right' size={16} />
                  </Text>
                  <Text className='text-lg tracking-wide'>
                    {item.destination}
                  </Text>
                </View>
              </View>
              <View className='mt-4'>
                <View className='flex-col gap-1'>
                  <View className='flex-row'>
                    <View className='mr-2 flex-row'>
                      <Text className='mr-0.5 self-center text-slate-500'>
                        <Feather name='truck' />
                      </Text>
                      <Text className='mr-2 text-slate-500'>
                        {item.vehicle_registration_identifier}
                      </Text>
                      <Text className='text-slate-500'>(</Text>
                      <Text className='text-slate-500'>
                        {item.start_kilometres.toLocaleString()} km
                      </Text>
                      <Text className='m-0.5 self-center text-slate-500'>
                        <Feather name='arrow-right' />
                      </Text>
                      <Text className='text-slate-500'>
                        {item.end_kilometres.toLocaleString()} km
                      </Text>
                      <Text className='text-slate-500'>)</Text>
                    </View>
                  </View>
                  <View className='flex-row'>
                    <Text className='mr-0.5 self-center text-slate-500'>
                      <Feather name='user' />
                    </Text>
                    <Text className='text-slate-500'>{item.employee_name}</Text>
                  </View>
                  {item.project_name && (
                    <View className='flex-row'>
                      <Text className='mr-0.5 self-center text-slate-500'>
                        <Feather name='clipboard' />
                      </Text>
                      <Text className='text-slate-500'>
                        {item.project_name}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              {item.comment && (
                <View className='mt-4'>
                  <View className='flex-row'>
                    <Text className='mr-0.5 self-center text-slate-500'>
                      <Feather name='message-circle' />
                    </Text>
                    <Text className='text-slate-500'>Bemerkungen</Text>
                  </View>
                  <Text className='font-light leading-5 tracking-wide'>
                    {item.comment}
                  </Text>
                </View>
              )}
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};
