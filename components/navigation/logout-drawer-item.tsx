import { useAuth } from '../../context/auth';
import { Feather } from '@expo/vector-icons';
import { DrawerItem } from '@react-navigation/drawer';

export const LogoutDrawerItem = () => {
  const auth = useAuth();

  return (
    <DrawerItem
      style={{ borderTopWidth: 1, borderTopColor: '#E2E8F0' }}
      label='Abmelden'
      icon={({ color, size }) => (
        <Feather name='log-out' color={color} size={size} />
      )}
      onPress={() => auth?.logout()}
    />
  );
};
