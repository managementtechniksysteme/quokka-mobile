import { Text, View } from 'react-native';
import { useUser } from '../../context/user';
import colors from 'tailwindcss/colors';
import Constants from 'expo-constants';

export const VersionDrawerItem = () => {
  const name = Constants.expoConfig?.name;
  const version = `v${Constants.expoConfig?.version}-${Constants.expoConfig?.extra?.versionCommitHash}`;

  return (
    <View className='flex-row justify-center px-3 py-3'>
      <Text className='text-xs text-slate-400'>
        {name} {version}
      </Text>
    </View>
  );
};
