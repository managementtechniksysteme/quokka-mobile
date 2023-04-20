import {
  ColorValue,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput as RNTextInput,
  TextInputEndEditingEventData,
  TextInputFocusEventData,
  TextInputProps as RNTextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import colors from 'tailwindcss/colors';
import { ReactNode, useState } from 'react';

const LABEL_COLOR = colors.slate['700'];
const PLACEHOLDER_COLOR = colors.slate['400'];
const SELECTION_COLOR = colors.green['600'];
const ERROR_COLOR = colors.red['600'];
const DISABLED_COLOR = colors.slate['300'];

type TextInputProps = {
  error?: string;
  style?: ViewStyle;
  label?: string;
  labelTextColor?: ColorValue;
  placeholderTextColor?: ColorValue;
  selectionColor?: ColorValue;
  disabled?: boolean;
  pressable?: boolean;
  onPress?: () => void;
  left?: ReactNode;
  right?: ReactNode;
} & RNTextInputProps;

export const TextInput = ({
  error,
  style,
  label,
  labelTextColor,
  placeholderTextColor,
  selectionColor,
  disabled,
  pressable,
  onPress,
  left,
  right,
  ...rest
}: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputColor = disabled ? DISABLED_COLOR : undefined;
  const inputLabelTextColor = disabled
    ? DISABLED_COLOR
    : labelTextColor || LABEL_COLOR;
  const inputSelectionColor = selectionColor || SELECTION_COLOR;
  const inputPlaceholderTextColor = disabled
    ? DISABLED_COLOR
    : error?.length
    ? ERROR_COLOR
    : isFocused
    ? inputSelectionColor
    : placeholderTextColor || PLACEHOLDER_COLOR;

  const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    rest.onFocus && rest.onFocus(e);
  };

  const onEndEditing = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {
    setIsFocused(false);
    rest.onEndEditing && rest.onEndEditing(e);
  };

  return (
    <View style={style}>
      {label && (
        <Text
          className='w-100 h-4 text-xs'
          style={{ color: inputLabelTextColor }}
        >
          {label}
        </Text>
      )}
      <View className='flex-row items-center'>
        {pressable ? (
          <Pressable
            className='flex-grow'
            disabled={disabled}
            onPress={onPress}
          >
            <View pointerEvents='none'>
              <InputElement
                style={{ color: inputColor }}
                placeholderTextColor={inputPlaceholderTextColor}
                selectionColor={inputSelectionColor}
                cursorColor={inputSelectionColor}
                editable={disabled}
                selectTextOnFocus={disabled}
                left={left}
                onFocus={onFocus}
                onEndEditing={onEndEditing}
                {...rest}
              />
            </View>
          </Pressable>
        ) : (
          <InputElement
            style={{ color: inputColor }}
            placeholderTextColor={inputPlaceholderTextColor}
            selectionColor={inputSelectionColor}
            editable={disabled}
            selectTextOnFocus={disabled}
            left={left}
            onFocus={onFocus}
            onEndEditing={onEndEditing}
            {...rest}
          />
        )}
        {!!right && (
          <Text style={{ color: inputPlaceholderTextColor }}>{right}</Text>
        )}
      </View>
      {error?.length && (
        <Text className='min-h-[16px] text-xs' style={{ color: ERROR_COLOR }}>
          {error}
        </Text>
      )}
    </View>
  );
};

type InputElementProps = {
  placeholderTextColor: ColorValue;
  selectionColor: ColorValue;
  left?: ReactNode;
  onFocus: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onEndEditing: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
} & RNTextInputProps;

const InputElement = ({
  placeholderTextColor,
  selectionColor,
  left,
  onFocus,
  onEndEditing,
  ...rest
}: InputElementProps) => {
  return (
    <>
      {!!left && (
        <View className='absolute h-full flex-row items-center'>
          <Text style={{ color: placeholderTextColor }}>{left}</Text>
        </View>
      )}
      <RNTextInput
        className={`w-full flex-shrink overflow-hidden py-2 ${
          !!left && 'pl-8'
        }`}
        placeholderTextColor={placeholderTextColor}
        selectionColor={selectionColor}
        style={{ fontSize: 16 }}
        onFocus={onFocus}
        onEndEditing={onEndEditing}
        {...rest}
      />
    </>
  );
};
