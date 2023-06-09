import { useAuth } from '../../context/auth';
import { Feather } from '@expo/vector-icons';
import { DrawerItem } from '@react-navigation/drawer';
import { View } from 'react-native';

export const LogoutDrawerItem = () => {
  const auth = useAuth();

  return (
    <View className='mt-1 border-t border-slate-200 pt-1'>
      <DrawerItem
        label='Abmelden'
        icon={({ color, size }) => (
          <Feather name='log-out' color={color} size={size} />
        )}
        onPress={() => auth?.logout()}
      />
    </View>
  );
};
