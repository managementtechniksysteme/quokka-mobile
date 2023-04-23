import { ReactNode } from 'react';
import { Text, View } from 'react-native';

type ChangelogEntryPops = {
  children: ReactNode;
};

export const ChangelogEntry = ({ children, ...rest }: ChangelogEntryPops) => {
  return (
    <View className='mt-0.5 flex-row items-start gap-1'>
      <Text className='mt-1 leading-5 tracking-wide text-slate-900'>-</Text>
      <Text className='mt-1 leading-5 tracking-wide text-slate-900' {...rest}>
        {children}
      </Text>
    </View>
  );
};
