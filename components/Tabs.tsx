import React, { useEffect, useRef } from 'react'
import { Text, View, Pressable, Animated, LayoutChangeEvent } from 'react-native'

type Tab<T extends string> = {
  key: T
  label: string
  icon?: React.ReactNode
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[]
  activeTab: T
  onChange: (key: T) => void
}

const Tabs = <T extends string>({ tabs, activeTab, onChange }: TabsProps<T>) => {
  const translateX = useRef(new Animated.Value(0)).current
  const containerWidth = useRef(0)

  const activeIndex = tabs.findIndex(t => t.key === activeTab)

  useEffect(() => {
    if (!containerWidth.current) return

    const tabWidth = containerWidth.current / tabs.length

    Animated.timing(translateX, {
      toValue: activeIndex * tabWidth,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }, [activeIndex, tabs.length, translateX])

  const onLayout = (e: LayoutChangeEvent) => {
    containerWidth.current = e.nativeEvent.layout.width
  }

  return (
    <View
      onLayout={onLayout}
      className="flex-row bg-gray-200 p-1 rounded-xl mb-4"
    >
      {/* Fondo animado */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          height: '100%',
          width: `${98 / tabs.length}%`,
          backgroundColor: 'white',
          borderRadius: 8,
          transform: [{ translateX }],
        }}
      />

      {tabs.map(tab => {
        const isActive = tab.key === activeTab

        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            className="flex-1 py-2"
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text className={`${isActive ? 'text-indigo-700' : 'text-gray-500'}`}> {tab.icon} </Text>
              <Text className={`text-sm font-semibold ${isActive ? 'text-indigo-700' : 'text-gray-500'}`}>{tab.label}</Text>
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}

export default Tabs
