import { ReactNode } from 'react';
import { Text } from 'react-native';

type ChangelogHeaderPops = {
  children: ReactNode;
};

export const ChangelogHeader = ({ children, ...rest }: ChangelogHeaderPops) => {
  return (
    <Text className='mt-4 text-lg font-bold' {...rest}>
      {children}
    </Text>
  );
};
