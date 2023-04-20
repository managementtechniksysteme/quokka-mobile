import { AccountingListEntry } from '../../api/accountingEndpoint';
import { GestureResponderEvent, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

export type AccountingListItemProps = {
  item: AccountingListEntry;
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
};

export const AccountingListItem = ({
  item,
  onPress,
  onLongPress,
}: AccountingListItemProps) => (
  <Pressable
    style={({ pressed }) => [
      pressed ? { backgroundColor: '#f1f5f9' } : { backgroundColor: 'white' },
    ]}
    onPress={onPress}
    onLongPress={onLongPress}
  >
    <View className='p-3'>
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
            {item.amount}
            {item.service_unit}
          </Text>
        </View>
      </View>
      <View className='mt-1'>
        <Text className='text-lg'>{item.service_name}</Text>
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
    </View>
  </Pressable>
);
