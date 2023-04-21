import { useAuth } from '../../context/auth';
import { Feather } from '@expo/vector-icons';
import { DrawerItem } from '@react-navigation/drawer';
import { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import { Text, View } from 'react-native';
import colors from 'tailwindcss/colors';
import { UpdateEvent } from 'expo-updates';
import { LoadingAnimation } from '../animations/loading-animation';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export const UpdateDrawerItem = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updating, setUpdating] = useState(false);

  const update = async () => {
    setUpdating(true);
    await Updates.reloadAsync().catch(() => setUpdating(false));
    setUpdating(false);
  };

  const updateEventListener = (event: UpdateEvent) => {
    if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
      setUpdateAvailable(true);
    }
  };

  Updates.useUpdateEvents(updateEventListener);

  const rotation = useSharedValue(0);

  const spinnerAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotation.value}deg`,
        },
      ],
    };
  }, [rotation.value]);

  useEffect(() => {
    if (updating) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1
      );
    }
  }, [updating]);

  if (!updateAvailable) {
    return null;
  }

  return (
    <View className='mt-1 border-t border-slate-200 pt-1'>
      {updating ? (
        <LoadingAnimation>
          <DrawerItem
            label='Aktualisiere'
            inactiveTintColor={colors.green['700']}
            icon={({ color, size }) => (
              <Animated.View style={spinnerAnimation}>
                <Feather name='refresh-cw' color={color} size={size} />
              </Animated.View>
            )}
            onPress={() => update()}
          />
        </LoadingAnimation>
      ) : (
        <DrawerItem
          label='Update verfügbar'
          inactiveTintColor={colors.green['700']}
          icon={({ color, size }) => (
            <Feather name='refresh-cw' color={color} size={size} />
          )}
          onPress={() => update()}
        />
      )}
    </View>
  );
};
