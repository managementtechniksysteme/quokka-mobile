import { ExpoConfig, ConfigContext } from 'expo/config';

module.exports = ({ config }: ConfigContext): ExpoConfig => {
  const commonConfig = {
    slug: 'quokka-mobile',
    name: 'Quokka Mobile',
  };

  if (process.env.ENVIRONMENT === 'production') {
    return {
      ...config,
      ...commonConfig,
      extra: {
        ...config.extra,
        apiUrl: 'https://quokka.linkto.ms/api',
      }
    };
  } else {
    return {
      ...config,
      ...commonConfig,
      extra: {
        ...config.extra,
        apiUrl: process.env.API_URL || 'http://192.168.100.10:8000/api',
      }
    }
  }
}
