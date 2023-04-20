import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {Slot, useRouter} from 'expo-router';
import {Provider as AuthProvider, Tokens} from "../context/auth";
import {Provider as UserProvider} from "../context/user";
import * as SecureStore from "expo-secure-store";
import {useEffect, useState} from "react";
import {SplashScreen} from "../components/splash-screen";
import {QueryClient, QueryClientProvider} from "react-query";
import i18next from "i18next";
import {z} from "zod";
import {zodI18nMap} from "zod-i18n-map";
import translation from "zod-i18n-map/locales/de/zod.json";
import {getLocales} from "expo-localization";
import * as Font from 'expo-font';
import {Feather, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import {Provider as NotificationProvider} from '../context/notification'
import {refreshTokens} from "../api/config/client";
import {prefetchUser} from "../api/userEndpoint";

const MIN_SPLASH_DURATION = 3000;

const theme = {
  ...DefaultTheme,
  colors: {
    "primary": "rgb(0, 109, 48)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(149, 248, 167)",
    "onPrimaryContainer": "rgb(0, 33, 10)",
    "secondary": "rgb(81, 99, 81)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(211, 232, 209)",
    "onSecondaryContainer": "rgb(14, 31, 17)",
    "tertiary": "rgb(57, 101, 109)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(189, 234, 244)",
    "onTertiaryContainer": "rgb(0, 31, 36)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(252, 253, 247)",
    "onBackground": "rgb(26, 28, 25)",
    "surface": "rgb(252, 253, 247)",
    "onSurface": "rgb(26, 28, 25)",
    "surfaceVariant": "rgb(221, 229, 218)",
    "onSurfaceVariant": colors.slate['500'],
    "outline": "rgb(114, 121, 112)",
    "outlineVariant": "rgb(193, 201, 190)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(46, 49, 46)",
    "inverseOnSurface": "rgb(240, 241, 236)",
    "inversePrimary": "rgb(121, 219, 141)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(239, 246, 237)",
      "level2": "rgb(232, 242, 231)",
      "level3": "rgb(224, 237, 225)",
      "level4": "rgb(222, 236, 223)",
      "level5": "rgb(217, 233, 219)"
    },
    "surfaceDisabled": "rgba(26, 28, 25, 0.12)",
    "onSurfaceDisabled": "rgba(26, 28, 25, 0.38)",
    "backdrop": "rgba(43, 50, 43, 0.4)"
  }
};

export default function Layout() {
  const router = useRouter();
  const queryClient = new QueryClient();

  const [appIsReady, setAppIsReady] = useState(false);
  const [tokens, setTokens] = useState<Tokens|null>(null);
  const [user, setUser] = useState<User|null>(null);

  const loadAssets = async () => {
    await i18next.init({
      compatibilityJSON: 'v3',
      lng: getLocales()[0].languageCode,
      resources: {
        de: { zod: translation },
      },
    });
    z.setErrorMap(zodI18nMap)

    await Font.loadAsync(Feather.font);
    await Font.loadAsync(MaterialCommunityIcons.font);
    await Font.loadAsync(Ionicons.font);

    const refreshToken = await SecureStore.getItemAsync('refreshToken');

    const newTokens =
      refreshToken ?
        await refreshTokens(refreshToken).catch(() => {return null;}) :
        null;

    setTokens(newTokens);

    if(newTokens) {
      setUser(await prefetchUser(queryClient, newTokens.token));
    }
  }

  const prepareApp = async () => {
    setAppIsReady(false);

    await Promise.all([
      loadAssets(),
      new Promise(r => setTimeout(r, MIN_SPLASH_DURATION))
    ]);

    setAppIsReady(true);
  }

  useEffect(() => {
    prepareApp();
  }, []);

  if(!appIsReady) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider initialUser={user}>
        <AuthProvider tokens={tokens}>
          <PaperProvider theme={theme}>
            <NotificationProvider>
              <Slot />
            </NotificationProvider>
          </PaperProvider>
        </AuthProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
