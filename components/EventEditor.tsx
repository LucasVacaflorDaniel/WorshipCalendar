import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View, Modal, TextInput, ScrollView } from 'react-native';

import { Musician, Instrument, ServiceDay, ServiceMusician } from '../src/types';
import DeleteConfirmModal from './DeleteConfirmModal';
import Select from './Select';
import { format } from '../src/dates';

interface EventEditorProps {
  showEventEditor: boolean
  setShowEventEditor: (show: boolean) => void;
  selectedDayToEdit: ServiceDay;
  setSelectedDayToEdit: (day: ServiceDay) => void;
  store: any;
}

const EventEditor = ({ 
  showEventEditor,
  setShowEventEditor,
  selectedDayToEdit,
  setSelectedDayToEdit,
  store
}: EventEditorProps) => {
  const { musicians, instruments, upsertServiceDay, deleteServiceDay } = store;

  const copySelectedDayToEdit = {...selectedDayToEdit}

  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const availableMusicians = musicians.filter((m: Musician) => m.active);
  const availableInstruments = instruments.filter((i: Instrument) => i.active);

  const isMusicianDisabled = (musicianId: string, idx: number) => {
    return selectedDayToEdit.instrumentalists.some(
      (pair, i) => pair.musicianId === musicianId && i !== idx
    )
  }
  const isInstrumentDisabled = (instrumentId: string, idx: number) =>{
    return selectedDayToEdit.instrumentalists.some(
      (pair, i) => pair.instrumentId === instrumentId && i !== idx
    )
  }

  const selectDirectors = (m:Musician) => {
    if (!selectedDayToEdit.singers.includes(m.id)) {
      const newDirectors = selectedDayToEdit.directors.includes(m.id) ? selectedDayToEdit.directors.filter(id=> id !== m.id) : [...selectedDayToEdit.directors, m.id]
      setSelectedDayToEdit({...selectedDayToEdit, directors: newDirectors})
    }
  }

  const selectSingers = (m:Musician) => {
    if (!selectedDayToEdit.directors.includes(m.id)) {
      const newSingers = selectedDayToEdit.singers.includes(m.id) ? selectedDayToEdit.singers.filter(id=> id !== m.id) : [...selectedDayToEdit.singers, m.id]
      setSelectedDayToEdit({...selectedDayToEdit, singers: newSingers})
    }
  }

  const selectInstrumentalists = (instrumetalist: ServiceMusician) => {
    let newInstrumentalists = [...selectedDayToEdit.instrumentalists]
    if (selectedDayToEdit.instrumentalists.includes(instrumetalist)) {
      newInstrumentalists = newInstrumentalists.filter(i => i !== instrumetalist)
    } else {
      newInstrumentalists.push(instrumetalist)
    }
    setSelectedDayToEdit({...selectedDayToEdit, instrumentalists: newInstrumentalists})
  }

  const updateInstrumentalist = (
    idx: number,
    patch: Partial<ServiceMusician>
  ) => {
    const editedInstrumentalist = { ...selectedDayToEdit.instrumentalists[idx], ...patch}
    const editedInstrumentalists = [...selectedDayToEdit.instrumentalists]
    editedInstrumentalists[idx] = editedInstrumentalist

    setSelectedDayToEdit({
      ...selectedDayToEdit,
      instrumentalists: editedInstrumentalists
    })
  }

  const onClose = () => {
    setSelectedDayToEdit(copySelectedDayToEdit)
    setError(null)
    setShowEventEditor(false)
  }

  const handleSave = () => {
    if (selectedDayToEdit.directors.length === 0) {
      setError('Debes asignar al menos un director.');
      return;
    }

    const newInstrumentalists = selectedDayToEdit.instrumentalists.filter( ins => ins.musicianId !=='' && ins.instrumentId !=='')

    upsertServiceDay({
      id: selectedDayToEdit.id,
      title: selectedDayToEdit.title?.trim() || 'Reunión Gral.',
      directors: selectedDayToEdit.directors,
      singers: selectedDayToEdit.singers,
      instrumentalists: newInstrumentalists
    });
    setShowEventEditor(false)
  };

  const confirmDelete = () => {
    deleteServiceDay(selectedDayToEdit.id);
    setError(null)
    setShowEventEditor(false)
  };

  return (
    <Modal
      visible= {showEventEditor}
      transparent={true}
      animationType="fade"
    >
      <View className="bg-black/60 backdrop-blur-sm flex-1 items-center justify-center p-4 animate-in fade-in duration-200">
        <View className="bg-white rounded-2xl min-h-[90vh] max-h-[90vh] flex">
          <View className="p-5 rounded-t-2xl border-b-gray-200 flex flex-row justify-between items-center bg-gray-100">
            <View>
              <Text className="text-2xl font-bold text-gray-800">Organizar Día</Text>
              <Text className="text-indigo-600 font-medium capitalize">{format(selectedDayToEdit.id, "EEEE, d 'de' MMMM", { locale: 'ES' })}</Text>
            </View>
            <Pressable onPress={onClose}>
              <Text className='flex-1'><Feather name="x" size={32} /></Text>
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} >
            <View className="flex p-6 space-y-8">
              {error && (
                <View className="p-3 mb-4 bg-red-50 rounded-lg flex items-center gap-2 border border-red-100">
                  <Text className='text-red-600'><Feather name="alert-circle" size={32} /></Text>
                  <Text className='text-red-600 text-sm font-medium'>{error}</Text>
                </View>
              )}
              <View className='block mb-4'>
                <Text className="font-bold text-gray-400 uppercase tracking-widest mb-2">Nombre de la Reunión</Text>
                <TextInput 
                  placeholder="Ej: Reunión Gral., Especial de Jóvenes..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 font-semibold transition-all"
                  value={selectedDayToEdit.title}
                  onChangeText={(text) => setSelectedDayToEdit({...selectedDayToEdit, title: text})}
                />
              </View>

              <View className='block mb-4'>
                <Text className="font-bold text-gray-400 uppercase tracking-widest mb-2">Dirección</Text>
                <View className="flex flex-row flex-wrap gap-2">
                  {availableMusicians.map((m: Musician) => (
                  <Pressable
                    key={m.id}
                    onPress={() => {
                      selectDirectors(m)
                      setError(null);
                    }}
                    className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 border-2 ${selectedDayToEdit.directors.includes(m.id) ? 'bg-indigo-600 border-indigo-600' : (selectedDayToEdit.singers.includes(m.id) ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-100')}`}
                  >
                    <Text className={`text-sm font-semibold ${selectedDayToEdit.directors.includes(m.id) ? 'text-white' : (selectedDayToEdit.singers.includes(m.id) ? 'text-gray-400' : 'text-gray-600')}`}>{m.name.split(' ')[0]}</Text>
                  </Pressable>
                ))}
                </View>
              </View>

              <View className='block mb-4'>
                <Text className="font-bold text-gray-400 uppercase tracking-widest mb-2">Voces / Coros</Text>
                <View className="flex flex-row flex-wrap gap-2">
                  {availableMusicians.map((m: Musician) => (
                  <Pressable
                    key={m.id}
                    onPress={() => {
                      selectSingers(m)
                      setError(null);
                    }}
                    className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 border-2 ${selectedDayToEdit.singers.includes(m.id) ? 'bg-pink-600 border-pink-600' : (selectedDayToEdit.directors.includes(m.id) ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-100')}`}
                  >
                    <Text className={`text-sm font-semibold ${selectedDayToEdit.singers.includes(m.id) ? 'text-white' : (selectedDayToEdit.directors.includes(m.id) ? 'text-gray-400' : 'text-gray-600')}`}>{m.name.split(' ')[0]}</Text>
                  </Pressable>
                ))}
                </View>
              </View>

              <View className='block'>
                <View className="flex flex-row justify-between items-center mb-3">
                  <Text className="font-bold text-gray-400 uppercase tracking-widest mb-2">Músicos e Instrumentos</Text>
                  <Pressable 
                    onPress={() => selectInstrumentalists({ musicianId: '', instrumentId: '' })}
                    className="flex flex-row items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg active:bg-indigo-100 transition-colors" >
                    <Text className='text-indigo-600'><Feather name="plus" size={24} /></Text>
                    <Text className='text-sm font-bold text-indigo-600'>Añadir</Text>
                  </Pressable>
                </View>
                <View className="space-y-3">
                  <View className={`flex bg-gray-50 p-3 rounded-xl border ${selectedDayToEdit.instrumentalists.length === 0 ? 'border-dashed' : 'border-solid'} border-gray-200 gap-2`}>
                    {selectedDayToEdit.instrumentalists.length === 0
                      ? (
                        <Text className="text-xs text-gray-400 italic text-center">No hay instrumentos asignados aún.</Text>
                      ) : selectedDayToEdit.instrumentalists.map((item, idx) => (
                      <View key={idx} className="flex flex-row justify-between items-center gap-2">
                        <View className='flex flex-1 flex-row justify-between items-center'>
                          <Select
                            options={availableMusicians.map((m: Musician) => ({
                              id: m.id,
                              name: m.name,
                              disabled: isMusicianDisabled(m.id, idx),
                            }))}
                            value={item.musicianId}
                            placeholder="Elegir Músico"
                            onChange={(musicianId: string) => {
                              updateInstrumentalist(idx, { musicianId })
                            }}
                          />
                          <Select
                            options={availableInstruments.map((i: Instrument) => ({
                              id: i.id,
                              name: i.name,
                              disabled: isInstrumentDisabled(i.id, idx),
                            }))}
                            value={item.instrumentId}
                            placeholder="Instrumento"
                            onChange={(instrumentId: string) => {
                              updateInstrumentalist(idx, { instrumentId })
                            }}
                          />
                        </View>
                        <Pressable className='p-2 active:bg-gray-200 rounded-xl' onPress={() => selectInstrumentalists(item)}>
                          <Text><Feather name="trash-2" size={20} /></Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          <View className='p-5 gap-2 rounded-b-2xl border-b-gray-200 flex flex-row justify-between items-center bg-gray-100/50'>
            <Pressable 
              onPress={() => {setShowDeleteConfirm(true)}}
              className="flex-1 p-3 bg-red-100 rounded-xl active:bg-red-200 transition-colors">
              <View className='flex-row gap-2 items-center justify-center'>
                <Text className="text-red-600"><Feather name="trash-2" size={20} /></Text>
                <Text className="text-red-600 font-bold text-xl">Eliminar Día</Text>
              </View>
            </Pressable>
            <Pressable 
              onPress={handleSave}
              className="flex-[2] p-3 bg-indigo-600 rounded-xl shadow-lg active:bg-indigo-700 transition-colors">
              <View className='flex-row gap-2 items-center justify-center'>
                <Text className='text-white'><Feather name="save" size={20} /></Text>
                <Text className='text-white font-bold text-xl'>Guardar Cambios</Text>
              </View>
            </Pressable>
          </View>
        </View>
        <DeleteConfirmModal
          showDeleteConfirm={showDeleteConfirm}
          onConfirm={() => {confirmDelete(); setShowDeleteConfirm(false);}}  
          onCancel={() => {setShowDeleteConfirm(false); setShowDeleteConfirm(false);}}
        />
      </View>
    </Modal>
  )
}

export default EventEditor;