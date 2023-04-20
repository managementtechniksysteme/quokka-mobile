import { LogbookListEntry } from '../../api/logbookEndpoint';
import { GestureResponderEvent, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as React from 'react';

export type LogbookListItemProps = {
  item: LogbookListEntry;
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
};

export const LogbookListItem = ({
  item,
  onPress,
  onLongPress,
}: LogbookListItemProps) => (
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
      </View>
      <View className='mt-1'>
        <View className='flex-row'>
          <Text className='text-lg'>{item.origin}</Text>
          <Text className='mx-1 self-center text-lg text-slate-500'>
            <Feather name='arrow-right' size={16} />
          </Text>
          <Text className='text-lg'>{item.destination}</Text>
        </View>
      </View>
      <View className='mt-4'>
        <View className='flex-row gap-2'>
          <View className='flex-row'>
            <Text className='mr-0.5 self-center text-slate-500'>
              <Feather name='truck' />
            </Text>
            <Text className='text-slate-500'>
              {item.vehicle_registration_identifier}
            </Text>
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
