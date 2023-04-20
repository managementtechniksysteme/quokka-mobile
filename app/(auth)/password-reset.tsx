import { ImageBackground, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import authBackground from '../../assets/images/auth_background.jpg';
import { Hero } from '../../components/hero';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_BASE_URL } from '../../api/config/config';
import { setServerErrors } from '../../utils/form';
import React, { useState } from 'react';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useNotification } from '../../context/notification';

export default function PasswordResetScreen() {
  const notification = useNotification();

  const [instructionsSent, setInstructionsSent] = useState(false);

  const PasswordResetSchema = z.object({
    username: z.string().min(1),
  });

  type PasswordResetValidationSchema = z.infer<typeof PasswordResetSchema>;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetValidationSchema>({
    reValidateMode: 'onSubmit',
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      username: '',
    },
  });

  const onSubmit = async (data: PasswordResetValidationSchema) => {
    let responseStatus: number;

    await fetch(`${API_BASE_URL}/forgot-password`, {
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
          setServerErrors<PasswordResetValidationSchema>(data.errors, setError);
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

        notification.showNotification(
          'Die Anweisungen wurden per Email versendet..',
          'success'
        );
        setInstructionsSent(true);
      })
      .catch(() => {
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
          <Hero />

          <Text className='mt-8 w-screen max-w-xl px-6 font-light leading-5 tracking-wide text-slate-900'>
            Du kannst dein Passowrt mit Hilfe einer Email zurücksetzten.
            Anweisungen zum Zurucksetzen werden nach der Anforderung an die
            Email Adresse des eingegebenen Benutzers gesendet.
          </Text>

          {instructionsSent && (
            <Text className='mt-8 w-screen max-w-xl px-6 text-center text-xl font-bold tracking-wide text-green-600'>
              Die Anweisungen wurden per Email versendet!
            </Text>
          )}

          {!instructionsSent && (
            <View className='mt-8 w-screen max-w-xl self-center px-6'>
              <Controller
                name='username'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode='outlined'
                    label='Benutzeranme'
                    value={value}
                    autoCapitalize='none'
                    autoComplete='username'
                    autoCorrect={false}
                    error={!!errors.username}
                    onChangeText={(value) => onChange(value)}
                    onBlur={onBlur}
                  />
                )}
              />
              <HelperText type='error'>{errors.username?.message}</HelperText>

              <Button
                mode='contained'
                className='mt-6'
                loading={isSubmitting}
                disabled={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              >
                Passwort zurücksetzen
              </Button>

              {errors.root?.custom && (
                <View className='mt-4'>
                  <Text className='self-center font-bold text-red-500'>
                    {errors.root?.custom?.message}
                  </Text>
                </View>
              )}
            </View>
          )}

          <Link
            className='absolute bottom-8 self-center font-light text-slate-900'
            href='/login'
          >
            Zurück zum Login
          </Link>
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}
