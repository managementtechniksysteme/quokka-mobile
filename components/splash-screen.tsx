import {ImageBackground, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import splashBackground from '../assets/images/splash.png';

export const SplashScreen = () => {
  return (
    <ImageBackground
      source={splashBackground}
      className='flex h-screen w-screen'
      resizeMode='contain'
    >
      <View className='h-screen flex-col items-center justify-center gap-5 bg-green-600'>
        <ActivityIndicator animating={true} size='large' color='#ffffff' />
      </View>
    </ImageBackground>
  );
}
