import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View, Modal } from 'react-native';

interface DeleteConfirmModalProps {
  showDeleteConfirm: boolean
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

const DeleteConfirmModal = ({ 
  showDeleteConfirm,
  onConfirm,
  onCancel,
  title = "¿Estas seguro?",
  message = "Esta accion no se puede deshacer. Se perderán todos los datos asgignados."
}: DeleteConfirmModalProps) => {
  return (
    <Modal
      visible= {showDeleteConfirm}
      transparent={true}
      animationType="fade"
    >
      <View className="inset-0 z-[200] bg-black/60 backdrop-blur-sm flex-1 items-center justify-center p-4 animate-in fade-in duration-200">
        <View className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
          <View className="p-6">
            <View className="w-16 h-16 bg-red-50 rounded-full flex items-center mx-auto mb-4">
              <Feather name="alert-triangle" size={44} color="#fb2c36" />
            </View>
            <Text className="text-center text-2xl font-bold text-gray-800 mb-2">{title}</Text>
            <Text className="text-center text-xl text-gray-500 leading-relaxed mb-6">{message}</Text>
            <View className="flex flex-col gap-2">
              <Pressable
                onPress={onConfirm}
                className="w-full py-3 bg-red-600 rounded-xl shadow-lg active:bg-red-700 active:scale-95 transition-all"
              >
                <Text className='text-white font-bold text-center text-xl'>Sí, eliminar</Text>
              </Pressable>
              <Pressable
                onPress={onCancel}
                className="w-full py-3 bg-gray-100 rounded-xl active:bg-gray-200 active:scale-95 transition-all"
              >
                <Text className='text-gray-600 font-bold text-center text-xl'>Cancelar</Text>
              </Pressable>
            </View>  
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default DeleteConfirmModal;