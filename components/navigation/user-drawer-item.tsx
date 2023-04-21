import { Text, View } from 'react-native';
import { useUser } from '../../context/user';
import colors from 'tailwindcss/colors';

export const UserDrawerItem = () => {
  const { user } = useUser();

  return (
    <View className='mb-1 border-b border-slate-200'>
      <View className='mx-3 my-1 flex-row items-center p-1 pb-3'>
        <View
          className='mr-6 h-8 w-8 flex-row content-center justify-center rounded-full border'
          style={{
            backgroundColor: colors[user.avatar_colour]['300'],
            borderColor: colors[user.avatar_colour]['700'],
          }}
        >
          <Text
            className='self-center'
            style={{ color: colors[user.avatar_colour]['700'] }}
          >
            {user.username_avatar_string}
          </Text>
        </View>
        <Text className='text-2xl font-light tracking-wide'>
          {user.first_name}
        </Text>
      </View>
    </View>
  );
};
