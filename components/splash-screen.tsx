import {ImageBackground, Text, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import splashBackground from '../assets/images/splash_background.png';

export const SplashScreen = () => {
  return (
    <ImageBackground
      source={splashBackground}
      className='flex h-screen w-screen'
      resizeMode='cover'
    >
      <View className='h-screen flex-col items-center justify-center gap-5 bg-green-600'>
        <Text className='text-[256px] font-bold tracking-widest text-white'>
          Q
        </Text>
        <ActivityIndicator animating={true} size='large' color='#ffffff' />
      </View>
    </ImageBackground>
  );
}
