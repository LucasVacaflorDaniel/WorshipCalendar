import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons'
import { Text, ScrollView, View, Pressable, TextInput } from 'react-native';

import { Musician, Instrument } from '../src/types';
import DeleteConfirmModal from './DeleteConfirmModal';
import Tabs from './Tabs';

interface MusiciansViewProps {
  store: any;
};

const MusiciansView = ({ store }: MusiciansViewProps) => {
  const { 
    musicians, 
    instruments, 
    addMusician, 
    updateMusician, 
    toggleMusician, 
    deleteMusician,
    addInstrument, 
    updateInstrument, 
    toggleInstrument,
    deleteInstrument,
    getInitials
  } = store;

  const [activeSection, setActiveSection] = useState<'musicians' | 'instruments'>('musicians');
  const [showActive, setShowActive] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: string; name: string } | null>(null);
  const [newName, setNewName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ onConfirm: Function; onCancel: Function, title: string, message: string }>({ onConfirm: () => {}, onCancel: () => {}, title: '', message: '' });

  const handleAdd = () => {
    if (!newName.trim()) return;

    if (activeSection === 'musicians') {
      addMusician(newName.trim());
    } else {
      addInstrument(newName.trim());
    }
    setNewName('');
    setIsAdding(false);
    setShowActive(true); // Asegurar que vemos la lista de activos al agregar
  };

  const handleUpdate = () => {
    if (!editingItem || !newName.trim()) return;

    if (activeSection === 'musicians') {
      updateMusician(editingItem.id, newName.trim());
    } else {
      updateInstrument(editingItem.id, newName.trim());
    }
    setNewName('');
    setEditingItem(null);
  };

  const startEditing = (item: Musician | Instrument) => {
    setEditingItem({ id: item.id, name: item.name });
    setNewName(item.name);
    setIsAdding(false);
  };

  const filteredItems = (activeSection === 'musicians' ? musicians : instruments).filter(
    (item: any) => item.active === showActive
  );

  return (
    <View className="p-4 pb-0 flex-1">
      <Tabs 
        tabs={[
          {
            key: 'musicians',
            label: 'Musicos',
            icon: <Feather name="users" size={28}/>
          },
          {
            key: 'instruments',
            label: 'Instrumentos',
            icon: <Feather name="music" size={28}/>
          }
        ]}
        activeTab={activeSection}
        onChange={setActiveSection}
      />

      <View className="space-y-4 gap-4 mb-4">
        <View className='flex flex-row justify-between items-center'>
          <Pressable 
            onPress = {() => {
              setIsAdding(true);
              setEditingItem(null);
              setNewName('');
            }}
            className='p-2 bg-indigo-600 rounded-full shadow-lg transition-transform active:scale-90 flex intms-center justify-center'
          >
            <Feather name="plus" size={24} color={'#fff'} />
          </Pressable>

          <Pressable onPress = {() => setShowActive(!showActive)} className={`w-[40%] flex items-start gap-2 px-3 py-1 rounded-xl transition-all border ${
              showActive 
                ? 'bg-white border-gray-200' 
                : 'bg-amber-50 border-amber-100'
            }`}>
            <View className='flex flex-row items-center gap-2'>
              {showActive ? (
                <>
                  <Feather name="archive" size={24} color={'#99a1af'} />
                  <Text className='text-gray-400 font-bold'> Ver Desactivados</Text>
                </>
              ) : (
                <>
                  <Feather name="power" size={24} color={'#e17100'} />
                  <Text className='text-amber-600 font-bold'> Ver Habilitados</Text>
                </>
              )}
            </View>
          </Pressable>
        </View>
      </View>
        {filteredItems.length !== 0 && (
          <View className="px-1 mb-2">
            <Text className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]"> 
              {filteredItems.length} {activeSection === 'musicians' ? 'Músicos' : 'Instrumentos'} {showActive ? 'Habilitados' : 'Desactivados'}
            </Text>
          </View>
        )}
        {(isAdding || editingItem) && (
          <View className="gap-4 bg-white p-4 rounded-xl border-2 border-indigo-100 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300 shadow-md mb-4">
            <View className="flex flex-row items-center gap-2">
              <Feather name="edit-2" size={16} />
              <Text className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{isAdding ? 'Agregar' : 'Editar'} {activeSection === 'musicians' ? 'Músico' : 'Instrumento'} </Text>
            </View>
            <View>
              <TextInput 
                placeholder={activeSection === 'musicians' ? 'Nombre' : 'Instrumento'} 
                className="w-full h-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                value={newName}
                onChangeText={(text) => setNewName(text)}
                autoFocus
              >
              </TextInput>
            </View>
            <View className="flex flex-row gap-4">
              <Pressable 
                onPress = {isAdding ? handleAdd : handleUpdate}
                className="flex-1 bg-indigo-600 py-2 rounded-lg shadow-sm transition-colors"
              >
                <Text className="text-center text-white font-bold">{isAdding ? 'Guardar' : 'Actualizar'}</Text>
              </Pressable>
              <Pressable 
                onPress = {() => {
                  setIsAdding(false);
                  setEditingItem(null);
                  setNewName('');
                }}
                className="flex-1 bg-gray-100 py-2 rounded-lg transition-colors"
              >
                <Text className="text-center text-gray-600 font-bold">Cancelar</Text>
              </Pressable>
            </View>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="grid grid-cols-1 gap-2 pb-2">
            {filteredItems.length === 0 ? (
              <View className='space-y-4'>
                <View className="py-10">
                  <Text className="mx-auto mb-2 opacity-20">
                    {showActive 
                      ? activeSection === 'musicians'
                          ? <Feather name="user-check" size={48} />
                          : <Feather name="music" size={48} />
                      : activeSection === 'musicians'
                          ? <Feather name="user-x" size={48} />
                          : <Feather name="volume-x" size={48} />
                    }
                  </Text>
                  <Text className="text-sm text-gray-400 font-medium text-center">
                    {showActive 
                      ? `No hay ${activeSection === 'musicians' ? 'músicos' : 'instrumentos'} habilitados.` 
                      : `No hay ${activeSection === 'musicians' ? 'músicos' : 'instrumentos'} desactivados.`
                    }
                  </Text>
                </View>
              </View>

              ) : (
                filteredItems.map((item: any) => (
                  <View key={item.id} className="flex flex-row items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all active:scale-[0.98]">
                    <Pressable className='flex flex-1' onPress={() => startEditing(item)}>
                      <View className="flex flex-row items-center gap-3">
                        {activeSection === 'musicians' ? (
                          <View className={`flex items-center justify-center`}>
                            <Text className={`w-10 h-10 text-center align-middle text-[18px] rounded-full font-bold ${item.active ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-400'}`}>{getInitials(item.name)}</Text>
                          </View>
                        ) : (
                          <View className={`w-10 h-10 rounded-full flex items-center justify-center ${item.active ? 'bg-indigo-100' : 'bg-gray-200'}`}>
                            <Feather name="music" size={18} color={ item.active ? '#432dd7' : '#99a1af'} />
                          </View>
                        )}
                        <View>
                          <Text className={`font-semibold ${item.active ? 'text-gray-800' : 'text-gray-400 italic'}`}>{item.name}</Text>
                          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.active ? 'Habilitado' : 'Desactivado'}</Text>
                        </View>
                      </View>
                    </Pressable>
                    <Pressable className="p-2 active:bg-gray-100 rounded-xl" onPress={() => { 
                      if (activeSection === 'musicians') toggleMusician(item.id)
                      else toggleInstrument(item.id) 
                    }}>
                      {item.active 
                        ? <Feather name="power" size={24} color={'#e17100'} /> 
                        : <Feather name="power" size={24} color={'#99a1af'} />
                      }
                    </Pressable>
                    <Pressable className="p-2 active:bg-gray-100 rounded-xl" onPress={() => { 
                      setShowDeleteConfirm(true);
                      setDeleteConfirm({
                        onConfirm: activeSection === 'musicians'
                          ? () => { deleteMusician(item.id); setShowDeleteConfirm(false); }
                          : () => { deleteInstrument(item.id); setShowDeleteConfirm(false); },
                        onCancel: () => setShowDeleteConfirm(false),
                        title: activeSection === 'musicians' ? 'Eliminar Músico' : 'Eliminar Instrumento',
                        message: `¿Estás seguro de que deseas eliminar este ${activeSection === 'musicians' ? 'músico' : 'instrumento'}? Esta acción no se puede deshacer.`
                      });
                    }}>
                      {item.active 
                        ? null
                        : <Feather name="x" size={24} color={'#fb2c36'} />
                      }
                    </Pressable>
                  </View>
                ))
              )
            }
          </View>
        </ScrollView>
      <DeleteConfirmModal 
        showDeleteConfirm={showDeleteConfirm}
        onConfirm={() => deleteConfirm.onConfirm()} 
        onCancel={() => deleteConfirm.onCancel()}
        title= {deleteConfirm.title}
        message= {deleteConfirm.message}
      />
    </View>
  );
};

export default MusiciansView;