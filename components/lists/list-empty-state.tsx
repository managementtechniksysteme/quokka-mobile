import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import emptyStateImage from '../../assets/images/empty_state.svg';

export const ListEmptyState = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView className='flex-col justify-center'>
        <View className='w-screen max-w-xl flex-col items-center self-center px-6 py-20'>
          <Image
            className='aspect-video w-full opacity-40'
            source={emptyStateImage}
            contentFit='contain'
          />
          <Text className='mt-4 text-lg font-light'>
            Es sind keine Daten zum Anzeigen vorhanden.
          </Text>
          <Text className='mt-4 font-light leading-5 tracking-wide text-slate-900'>
            Du kannst einen neuen Eintrag anlegen oder die Filter ändern, in dem
            du auf die entsprechende Symbole am oberen Bildschirmbereich tippst.
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
