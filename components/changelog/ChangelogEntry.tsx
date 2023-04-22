import {ReactNode} from "react";
import {Text, View} from "react-native";

type ChangelogEntryPops = {
  children: ReactNode
}

export const ChangelogEntry = ({children, ...rest}: ChangelogEntryPops) => {
  return (
    <View className='flex-row items-start gap-1 mt-0.5'>
      <Text className='tracking-wide leading-5 text-slate-900 mt-1'>
        -
      </Text>
      <Text className='tracking-wide leading-5 text-slate-900 mt-1' {...rest}>{children}</Text>
    </View>
  )
}