import { ReactNode } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { View, ViewProps } from 'react-native';

type LoadingAnimationProps = {
  backgroundColor?: string;
  children: ReactNode;
} & ViewProps;

export const LoadingAnimation = ({
  children,
  backgroundColor,
  ...rest
}: LoadingAnimationProps) => {
  const opacity = useSharedValue(1);

  opacity.value = withSequence(
    withTiming(0.5, { duration: 750, easing: Easing.ease }),
    withTiming(1, { duration: 750, easing: Easing.ease }),
    withRepeat(
      withDelay(
        2000,
        withSequence(
          withTiming(0.5, { duration: 750, easing: Easing.ease }),
          withTiming(1, { duration: 750, easing: Easing.ease })
        )
      ),
      -1,
      false
    )
  );

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }), []);

  return (
    <Animated.View
      style={{ ...style, backgroundColor: backgroundColor ?? undefined }}
    >
      <View {...rest}>{children}</View>
    </Animated.View>
  );
};
