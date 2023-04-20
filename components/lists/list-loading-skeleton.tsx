import { FlatList, View } from 'react-native';
import { ListItemSeparator } from './list-item-seperator';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LoadingAnimation } from '../animations/loading-animation';

type ListLoadingSkeletonProps = {
  elements?: number;
};

export const ListLoadingSkeleton = (props: ListLoadingSkeletonProps) => {
  const elements = Array.from({ length: props.elements || 20 }, () => ({}));

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <FlatList
          data={elements}
          renderItem={({ item }) => <SkeletonItem />}
          ItemSeparatorComponent={ListItemSeparator}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const SkeletonItem = () => {
  return (
    <LoadingAnimation backgroundColor='white'>
      <View className='bg-white p-3'>
        <View className='flex-row gap-3'>
          <View className='h-3 w-16 rounded bg-slate-100' />
          <View className='h-3 w-16 rounded bg-slate-100' />
        </View>
        <View className='mt-2 h-5 w-3/4 rounded bg-slate-100' />
        <View className='mt-4 h-3 w-2/4 rounded bg-slate-100' />
      </View>
    </LoadingAnimation>
  );
};
