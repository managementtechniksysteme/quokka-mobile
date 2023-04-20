import { GestureResponderEvent, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

type BottomSheetScrollViewStickyHeaderProps = {
  onClose: (event: GestureResponderEvent) => void;
};

export const BottomSheetScrollViewStickyHeader = ({
  onClose,
}: BottomSheetScrollViewStickyHeaderProps) => {
  return (
    <>
      <View className='mx-5 mb-3 flex-row justify-between border-b border-slate-200 bg-white pb-1'>
        <Text className='text-xl tracking-wide'>Details</Text>
        <Pressable className='self-center' onPress={onClose}>
          <Text>
            <Feather name='x' size={24} />
          </Text>
        </Pressable>
      </View>
    </>
  );
};
