import {
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInputEndEditingEventData,
  View,
} from 'react-native';
import React, { ForwardedRef, useMemo, useState } from 'react';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { CustomBottomSheetBackdrop } from './bottom-sheet-backdrop';
import { Feather } from '@expo/vector-icons';
import { ListItemSeparator } from '../lists/list-item-seperator';
import { Image } from 'expo-image';
import emptyStateImage from '../../assets/images/empty_state.svg';
import colors from 'tailwindcss/colors';

type SearchableSelectBottomSheetModalProps<T> = {
  options: T[];
  optionKey?: keyof T | undefined;
  optionKeyExtractor?: ((item: T) => string) | undefined;
  valueKey?: keyof T | undefined;
  valueExtractor?: ((item: T) => string) | undefined;
  creatable?: boolean | undefined;
  searchInputPlaceholder?: string;
  onSearch?: ((item: T, search: string) => boolean) | undefined;
  onSelect?: ((item: T) => void) | undefined;
  onDismiss?: (() => void) | undefined;
  ItemComponent?: any;
  emptyListMessage?: string | undefined;
  EmptyListComponent?: any;
  modalRef?: ForwardedRef<BottomSheetModal> | undefined;
};

export const SearchableSelectBottomSheetModal = <T,>({
  options,
  optionKey,
  optionKeyExtractor,
  valueKey,
  valueExtractor,
  creatable,
  searchInputPlaceholder,
  onSearch,
  onSelect,
  onDismiss,
  ItemComponent,
  emptyListMessage,
  EmptyListComponent,
  modalRef,
}: SearchableSelectBottomSheetModalProps<T>) => {
  const [search, setSearch] = useState<string>('');

  if (!optionKey && !optionKeyExtractor) {
    throw new Error(
      'optionKey or optionKeyExtractor parameter must be provided! '
    );
  }

  if (!valueKey && !valueExtractor) {
    throw new Error('optionKey or valueExtractor parameter must be provided!');
  }

  if (creatable && !optionKey && !valueKey) {
    throw new Error(
      'optionKey and valueKey must be specified when creatable is true!'
    );
  }

  const defaultFilter = () => {
    const tokens = search.toLowerCase().split(/(\s+)/);

    return options.filter((option) =>
      tokens.every((token) =>
        valueExtractor
          ? valueExtractor(option).toLowerCase().includes(token)
          : (option[valueKey!] as string).toLowerCase().includes(token)
      )
    );
  };

  const filteredOptions = useMemo(() => {
    let filteredItems = null;
    if (!search.length) {
      return options;
    }

    if (onSearch) {
      filteredItems = options.filter((option) => onSearch(option, search));
    }

    filteredItems = defaultFilter();

    if (!filteredItems.length && creatable) {
      filteredItems = [
        {
          [optionKey]: null,
          [valueKey]: search,
        } as T,
      ];
    }

    return filteredItems;
  }, [search]);

  const handleSelect = (selected: T) => {
    onSelect && onSelect(selected);
  };

  const handleDismiss = () => {
    setSearch('');
    onDismiss && onDismiss();
  };

  const listKeyExtractor = (item: T, index: number): string => {
    return optionKeyExtractor
      ? optionKeyExtractor(item)
      : (item[optionKey!] as string);
  };

  const defaultText = (item: T): string => {
    return valueExtractor ? valueExtractor(item) : (item[valueKey!] as string);
  };

  const defaultEmptyMessage = emptyListMessage ?? 'Keine passenden Einträge';

  return (
    <View>
      <BottomSheetModal
        ref={modalRef}
        snapPoints={['50%']}
        backdropComponent={CustomBottomSheetBackdrop}
        keyboardBlurBehavior='restore'
        onDismiss={handleDismiss}
        android_keyboardInputMode='adjustResize'
      >
        <BottomSheetFlatList
          style={{ paddingHorizontal: 12 }}
          data={filteredOptions}
          keyExtractor={listKeyExtractor}
          renderItem={({ item }) => (
            <OptionItem
              item={item}
              defaultText={defaultText(item)}
              onSelect={handleSelect}
              ItemComponent={ItemComponent}
            />
          )}
          ListHeaderComponent={
            <Header
              searchValue={search}
              onSearch={(search) => setSearch(search)}
              searchInputPlaceholder={searchInputPlaceholder}
            />
          }
          ListFooterComponent={<View className='h-6' />}
          stickyHeaderIndices={[0]}
          ItemSeparatorComponent={ListItemSeparator}
          ListEmptyComponent={
            <EmptyComponent
              defaultMessage={defaultEmptyMessage}
              EmptyComponent={EmptyListComponent}
            />
          }
        />
      </BottomSheetModal>
    </View>
  );
};

type HeaderProps = {
  searchValue: string;
  onSearch: (search: string) => void;
  searchInputPlaceholder?: string;
};

const Header = ({
  searchValue,
  onSearch,
  searchInputPlaceholder,
}: HeaderProps) => {
  const [searchIsFocused, setSearchIsFocused] = useState(false);

  const handleSearchFocus = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {
    setSearchIsFocused(true);
  };

  const handleSearchEndEditing = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {
    setSearchIsFocused(false);
  };

  return (
    <View className='border-b border-slate-200 bg-white pb-3'>
      <View className='flex-row items-center rounded-lg bg-slate-100 p-2'>
        <Text className='mr-2 text-slate-400'>
          <Feather
            name='search'
            size={24}
            color={searchIsFocused ? colors.green['600'] : colors.slate['400']}
          />
        </Text>
        <BottomSheetTextInput
          style={{
            fontSize: 24,
            flexGrow: 1,
          }}
          placeholder={searchInputPlaceholder ?? 'Suche'}
          placeholderTextColor={
            searchIsFocused ? colors.green['600'] : colors.slate['400']
          }
          cursorColor={colors.green['600']}
          autoCorrect={false}
          autoComplete='off'
          autoCapitalize='none'
          value={searchValue}
          onChangeText={(text) => onSearch(text)}
          onFocus={handleSearchFocus}
          onEndEditing={handleSearchEndEditing}
        />
        {!!searchValue.length && (
          <Pressable onPress={() => onSearch('')}>
            <Text className='text-slate-400'>
              <Feather name='x' size={24} />
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

type OptionItemProps<T> = {
  item: T;
  defaultText: string;
  onSelect: (item: T) => void | undefined;
  ItemComponent?: any;
};

const OptionItem = <T,>({
  item,
  defaultText,
  onSelect,
  ItemComponent,
}: OptionItemProps<T>) => {
  return ItemComponent ? (
    <Pressable onPress={() => onSelect(item)}>
      <ItemComponent item={item} />
    </Pressable>
  ) : (
    <Pressable
      style={({ pressed }) => [
        pressed ? { backgroundColor: '#f1f5f9' } : { backgroundColor: 'white' },
      ]}
      onPress={() => onSelect(item)}
    >
      <DefaultItemComponent text={defaultText} />
    </Pressable>
  );
};

type DefaultItemComponentProps = {
  text: string;
};

const DefaultItemComponent = ({ text }: DefaultItemComponentProps) => {
  return (
    <View className='min-h-[56px] flex-row items-center'>
      <Text className='px-3 text-2xl text-slate-700'>{text}</Text>
    </View>
  );
};

type EmptyComponentProps = {
  defaultMessage?: string;
  EmptyComponent?: any;
};

const EmptyComponent = ({
  defaultMessage,
  EmptyComponent,
}: EmptyComponentProps) => {
  return EmptyComponent ? (
    <EmptyComponent />
  ) : (
    <DefaultEmptyComponent message={defaultMessage!} />
  );
};

type DefaultEmptyComponentProps = {
  message: string;
};

const DefaultEmptyComponent = ({ message }: DefaultEmptyComponentProps) => {
  return (
    <View className='flex-col items-center self-center p-3'>
      <Image
        className='aspect-video w-full opacity-40'
        source={emptyStateImage}
        contentFit='contain'
      />
      <Text className='mt-4 text-lg font-light'>{message}</Text>
    </View>
  );
};
