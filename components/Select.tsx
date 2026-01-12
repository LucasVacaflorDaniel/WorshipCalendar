import { useState } from "react";
import { Modal, Pressable, Text, View, ScrollView } from "react-native"

interface SelectProps {
  options: { id: string | number; name: string; disabled?: boolean }[]
  placeholder?: string
  value: string | number | null
  onChange: Function
}

const Select = ({ options, placeholder, value, onChange }: SelectProps) => {
  const [selectOpen, setSelectOpen] = useState(false)
  const [selectValue, setSelectValue] = useState<string|number|null>(value)
  const selectedLabel = options.find(o => o.id === value)?.name ?? placeholder ?? 'Seleccionar...'

  return (
    <>
      <Pressable 
        onPress={() => setSelectOpen(true)}
        className="px-3 py-2 rounded-lg transition-all flex items-center gap-1 border-2 bg-white border-gray-100"
      >
        <Text className="text-sm font-semibold text-gray-600">
          {selectedLabel}
        </Text>
      </Pressable>
      <View className="absolute">
        <Modal
          visible={selectOpen}
          animationType="fade"
          transparent={true}
        >
          <Pressable
            className="bg-black/60 backdrop-blur-sm flex-1 items-center justify-center p-4 animate-in fade-in duration-200"
            onPress={() => setSelectOpen(false)}
          >
            <View className="bg-white rounded-2xl w-[60vw] min-h-[10vh] max-h-[60vh] flex">
              <ScrollView 
                showsVerticalScrollIndicator={false}
                className="bg-white rounded-2xl">
                {options.map(opt => (
                  <View key={opt.id} className="flex flex-row border-b border-gray-100">
                    <View className="flex justify-center items-center border-r border-gray-100 p-3">
                      <View className="bg-gray-300 rounded-full shadow-2xl w-4 h-4  flex justify-center items-center">
                        <View className={`${value === opt.id ? 'bg-indigo-500' : opt.disabled ? 'bg-gray-300' : 'bg-gray-500'} shadow-2xl w-3 h-3 rounded-full`}></View>
                      </View>  
                    </View>  
                    <Pressable
                      disabled={opt.disabled}
                      onPress={() => {
                        if (opt.disabled) return
                        onChange(opt.id)
                        setSelectOpen(false)
                        setSelectValue(opt.id)
                      }}
                      className={`flex flex-1 px-4 py-4 ${opt.disabled ? 'bg-gray-100 border-gray-200' : ''}`}
                      >
                      <Text className={`${opt.disabled ? 'text-gray-400' : 'text-gray-600'}`}>{opt.name}</Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      </View>
    </>
  )
}

export default Select
