import { useAuth } from '../../context/auth';
import { Feather } from '@expo/vector-icons';
import { DrawerItem } from '@react-navigation/drawer';
import colors from "tailwindcss/colors";
import {View} from "react-native";

export const LogoutDrawerItem = () => {
  const auth = useAuth();

  return (
    <View className='border-t border-slate-200 mt-1 pt-1'>
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
