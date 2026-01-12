import React from 'react';
import { Feather } from '@expo/vector-icons'
import { Text, View } from 'react-native';

const Header = () => {

  return (
    <View className="bg-white border-gray-200 border-b  shadow-[0_-1px_10px_rgba(0,0,0,0.05)] sticky z-50 px-6 py-4 mt-safe">
      <View className="flex flex-row items-center gap-2 text-gray-500">
        <Feather name="grid" size={24} />
        <Text className="text-xl font-bold text-indigo-700">
          Worship Calendar
        </Text>
      </View>
    </View>
  );
};

export default Header;