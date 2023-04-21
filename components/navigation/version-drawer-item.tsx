import { Text, View } from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

export const VersionDrawerItem = () => {
  const name = `${Constants.expoConfig?.name} ${Updates.channel === 'dev' ? 'dev' : Updates.channel === 'beta' ? 'beta' : ''}`;
  const version = `v${Constants.expoConfig?.version}-${Constants.expoConfig?.extra?.versionCommitHash}`;

  return (
    <View className='flex-row justify-center px-3 py-3'>
      <Text className='text-xs text-slate-400'>
        {name} {version}
      </Text>
    </View>
  );
};
