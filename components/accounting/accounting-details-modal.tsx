import { RefObject } from 'react';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AccountingListEntry } from '../../api/accountingEndpoint';
import { Text, View } from 'react-native';
import { CustomBottomSheetBackdrop } from '../sheets/bottom-sheet-backdrop';
import { BottomSheetScrollViewStickyHeader } from '../sheets/bottom-sheet-scroll-view-sticky-header';
import { Feather } from '@expo/vector-icons';

export type AccountingDetailsModalProps = {
  accountingDetailsModalRef: RefObject<BottomSheetModal>;
  item: AccountingListEntry | null;
};

export const AccountingDetailsModal = ({
  accountingDetailsModalRef,
  item,
}: AccountingDetailsModalProps) => {
  return (
    <View className='flex'>
      <BottomSheetModal
        ref={accountingDetailsModalRef}
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
              onClose={() => accountingDetailsModalRef?.current?.close()}
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
                    {item.service_provided_on.toLocaleDateString([], {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </Text>
                </View>
                <View className='flex-row'>
                  <Text className='mr-0.5 self-center text-slate-500'>
                    {item.service_type === 'material' ? (
                      <Feather name='credit-card' />
                    ) : (
                      <Feather name='clock' />
                    )}
                  </Text>
                  <Text className='text-slate-500'>
                    {item.amount.toLocaleString()}
                    {item.service_unit}
                  </Text>
                  {item.service_provided_started_at &&
                    item.service_provided_ended_at && (
                      <View className='ml-0.5 flex-row'>
                        <Text className='text-slate-500'>(</Text>
                        <Text className='text-slate-500'>
                          {item.service_provided_started_at.toLocaleTimeString(
                            [],
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </Text>
                        <Text className='m-0.5 self-center text-slate-500'>
                          <Feather name='arrow-right' />
                        </Text>
                        <Text className='text-slate-500'>
                          {item.service_provided_ended_at.toLocaleTimeString(
                            [],
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </Text>
                        <Text className='text-slate-500'>)</Text>
                      </View>
                    )}
                </View>
              </View>
              <View className='mt-1'>
                <Text className='text-lg tracking-wide'>
                  {item.service_name}
                </Text>
              </View>
              <View className='mt-4'>
                <View className='flex-col gap-1'>
                  <View className='flex-row'>
                    <Text className='mr-0.5 self-center text-slate-500'>
                      <Feather name='clipboard' />
                    </Text>
                    <Text className='text-slate-500'>{item.project_name}</Text>
                  </View>
                  <View className='flex-row'>
                    <Text className='mr-0.5 self-center text-slate-500'>
                      <Feather name='user' />
                    </Text>
                    <Text className='text-slate-500'>{item.employee_name}</Text>
                  </View>
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
