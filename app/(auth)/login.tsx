import {
  Dimensions,
  ImageBackground,
  Keyboard,
  LayoutChangeEvent,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button, HelperText, Switch, TextInput } from 'react-native-paper';
import { useRef, useState } from 'react';
import { Link } from 'expo-router';
import authBackground from '../../assets/images/auth_background.jpg';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Device from 'expo-device';
import { setServerErrors } from '../../utils/form';
import { Hero } from '../../components/hero';
import { API_BASE_URL } from '../../api/config/config';
import { useAuth } from '../../context/auth';
import { useNotification } from '../../context/notification';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import colors from "tailwindcss/colors";

export default function LoginScreen() {
  const notification = useNotification();

  const [hidePassword, setHidePassword] = useState(true);
  const [requireOtp, setRequireOtp] = useState(false);

  const [animatedViewY, setAnimatedViewY] = useState(0);
  const keyboardPadding = useSharedValue(0);

  let viewRef = useRef<View>(null);

  const measureAnimatedViewPosition = (event: LayoutChangeEvent) => {
    viewRef.current?.measure((y, pageY, height) => {
      // calculate top y position of the login dialog view
      setAnimatedViewY((Dimensions.get('window').height - height) / 2);
    });
  };

  Keyboard.addListener('keyboardDidShow', (event) => {
    // calculate the y shift for the login dialog view, taking into account some safety margin
    keyboardPadding.value = withSpring(-animatedViewY + 100, {
      damping: 20,
      stiffness: 90,
    });
  });

  Keyboard.addListener('keyboardDidHide', (event) => {
    keyboardPadding.value = withSpring(0, { damping: 20, stiffness: 90 });
  });

  const keyboardShiftAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: keyboardPadding.value,
        },
      ],
    };
  });

  const { login } = useAuth();

  const LoginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    remember_me: z.boolean(),
    device_name: z.string(),
  });

  type LoginValidationSchema = z.infer<typeof LoginSchema>;

  const TwoFactorOtpLoginSchema = LoginSchema.merge(
    z.object({
      one_time_password: z
        .string()
        .length(6)
        .regex(/^[0-9]+$/),
    })
  );

  type TwoFactorOtpLoginValidationSchema = z.infer<
    typeof TwoFactorOtpLoginSchema
  >;

  const commonDefaultValues = {
    username: '',
    password: '',
    remember_me: false,
    device_name:
      Device.modelName || Math.random().toString(20).substring(2, 10),
  };

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = requireOtp
    ? useForm<TwoFactorOtpLoginValidationSchema>({
        reValidateMode: 'onSubmit',
        resolver: zodResolver(TwoFactorOtpLoginSchema),
        defaultValues: {
          ...commonDefaultValues,
          one_time_password: '',
        },
      })
    : useForm<LoginValidationSchema>({
        reValidateMode: 'onSubmit',
        resolver: zodResolver(LoginSchema),
        defaultValues: {
          ...commonDefaultValues,
        },
      });

  const onSubmit = async (data: LoginValidationSchema) => {
    let responseStatus: number;

    await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        responseStatus = response.status;
        return response.json();
      })
      .then((data) => {
        if (responseStatus === 422) {
          setServerErrors<LoginValidationSchema>(data.errors, setError);
          return;
        }

        if (responseStatus !== 200) {
          notification.showNotification(
            'Es ist ein Serverfehler aufgetreten.',
            'danger'
          );
          setError('root.custom', {
            type: 'custom',
            message: 'Es ist ein Serverfehler aufgetreten.',
          });
          return;
        }

        if (
          data['one_time_password'] &&
          data['one_time_password'] === 'required'
        ) {
          setRequireOtp(true);
          return;
        }

        login(data.token, data.refresh_token);
      })
      .catch((error) => {
        notification.showNotification(
          'Es ist ein Netzwerkfehler aufgetreten.',
          'danger'
        );
        setError('root.custom', {
          type: 'custom',
          message: 'Es ist ein Netzerkfehler aufgetreten.',
        });
      });
  };

  const onSubmitTwoFactors = async (
    data: TwoFactorOtpLoginValidationSchema
  ) => {
    let responseStatus: number;

    await fetch(`${API_BASE_URL}/otp`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        responseStatus = response.status;
        return response.json();
      })
      .then((data) => {
        if (responseStatus === 422) {
          setServerErrors<TwoFactorOtpLoginValidationSchema>(
            data.errors,
            setError
          );
          return;
        }

        if (responseStatus !== 200) {
          notification.showNotification(
            'Es ist ein Serverfehler aufgetreten.',
            'danger'
          );
          setError('root.custom', {
            type: 'custom',
            message: 'Es ist ein Serverfehler aufgetreten.',
          });
          return;
        }

        login(data.token, data.refresh_token);
      })
      .catch((error) => {
        notification.showNotification(
          'Es ist ein Netzwerkfehler aufgetreten.',
          'danger'
        );
        setError('root.custom', {
          type: 'custom',
          message: 'Es ist ein Netzerkfehler aufgetreten.',
        });
      });
  };

  return (
    <ImageBackground
      source={authBackground}
      className='flex h-screen w-screen'
      imageStyle={{ opacity: 0.4 }}
      resizeMode='cover'
    >
      <SafeAreaProvider>
        <SafeAreaView className='h-screen flex-col justify-center'>
          <Animated.View
            ref={viewRef}
            onLayout={measureAnimatedViewPosition}
            className='w-screen max-w-xl self-center px-6'
            style={keyboardShiftAnimation}
          >
            <View className='mb-8'>
              <Hero />
            </View>

            <Controller
              name='username'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode='outlined'
                  value={value}
                  label='Benutzername'
                  autoCapitalize='none'
                  autoComplete='username'
                  autoCorrect={false}
                  selectionColor={colors.green['600']}
                  cursorColor={colors.green['600']}
                  disabled={requireOtp}
                  error={!!errors.username}
                  onChangeText={(value) => onChange(value)}
                  onBlur={onBlur}
                />
              )}
            />
            <HelperText type='error'>{errors.username?.message}</HelperText>
            <Controller
              name='password'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode='outlined'
                  label='Passwort'
                  value={value}
                  autoComplete='password'
                  autoCorrect={false}
                  secureTextEntry={hidePassword}
                  selectionColor={colors.green['600']}
                  cursorColor={colors.green['600']}
                  disabled={requireOtp}
                  error={!!errors.password}
                  onChangeText={(value) => onChange(value)}
                  onBlur={onBlur}
                  right={
                    <TextInput.Icon
                      icon={hidePassword ? 'eye' : 'eye-off'}
                      onPress={() => setHidePassword(!hidePassword)}
                    />
                  }
                />
              )}
            />
            <HelperText type='error' visible={!!errors.password}>
              {errors.password?.message}
            </HelperText>
            {requireOtp && (
              <>
                <Controller
                  name='one_time_password'
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      mode='outlined'
                      label='Einmalpasswort'
                      value={value}
                      autoCapitalize='none'
                      autoComplete='one-time-code'
                      autoCorrect={false}
                      keyboardType='number-pad'
                      maxLength={6}
                      selectionColor={colors.green['600']}
                      cursorColor={colors.green['600']}
                      error={!!errors.one_time_password}
                      onChangeText={(value) => onChange(value)}
                      onBlur={onBlur}
                    />
                  )}
                />
                <HelperText type='error' visible={!!errors.one_time_password}>
                  {errors.one_time_password?.message}
                </HelperText>
              </>
            )}

            <View className='mt-4 flex-row items-center justify-between'>
              <View className='flex-row items-center gap-1'>
                <Controller
                  name='remember_me'
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <Switch
                        className='mr-1'
                        onValueChange={(value) => onChange(value)}
                        value={value}
                      />
                      <Text>angemeldet bleiben</Text>
                    </>
                  )}
                />
              </View>
            </View>

            <Button
              mode='contained'
              className='mt-6'
              loading={isSubmitting}
              disabled={isSubmitting}
              onPress={handleSubmit(requireOtp ? onSubmitTwoFactors : onSubmit)}
            >
              Anmelden
            </Button>

            {errors.root?.custom && (
              <View className='mt-4'>
                <Text className='self-center font-bold text-red-500'>
                  {errors.root?.custom?.message}
                </Text>
              </View>
            )}
          </Animated.View>

          <Link
            className='absolute bottom-8 self-center font-light text-slate-900'
            href='/password-reset'
          >
            Passwort vergessen?
          </Link>
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}
