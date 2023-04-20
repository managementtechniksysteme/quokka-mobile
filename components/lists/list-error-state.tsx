import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import errorStateImage from '../../assets/images/error_state.svg';

type ListErrorStateProps = {
  onRefetch: Function;
};

export const ListErrorState = ({ onRefetch }: ListErrorStateProps) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView className='flex-col justify-center'>
        <View className='w-screen max-w-xl flex-col items-center self-center px-6 py-20'>
          <Image
            className='aspect-video w-full opacity-30'
            source={errorStateImage}
            contentFit='contain'
          />
          <Text className='mt-4 text-lg font-light'>
            Es trat ein Fehler beim Laden der Daten auf.
          </Text>
          <Button mode='contained' className='mt-6' onPress={() => onRefetch()}>
            Daten erneut laden
          </Button>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
