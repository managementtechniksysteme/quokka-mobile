import {ReactNode} from "react";
import {Text} from "react-native";

type ChangelogHeaderPops = {
  children: ReactNode
}

export const ChangelogHeader = ({children, ...rest}: ChangelogHeaderPops) => {
  return (
    <Text className='font-bold text-lg mt-4' {...rest}>{children}</Text>
  )
}