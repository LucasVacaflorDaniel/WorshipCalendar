import React, { useState } from 'react';
import * as Clipboard from 'expo-clipboard'
import { Feather } from '@expo/vector-icons'
import { Text, ScrollView, Pressable, View, Alert } from 'react-native';

import EventEditor from './EventEditor';
import Tabs from './Tabs';
import Calendar from './Calendar';
import { ServiceDay, Musician, Instrument } from '../src/types';
import { format } from '../src/dates';

type CalendarViewProps = {
  store: any;
};

const CalendarView = ({ store }: CalendarViewProps) => {
  const serviceDayFormat: ServiceDay = { id:'', title: '', directors: [], singers: [], instrumentalists:[]}

  const [activeSection, setActiveSection] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventEditor, setShowEventEditor] = useState(false);
  const [selectedDayToEdit, setSelectedDayToEdit] = useState< ServiceDay>(serviceDayFormat);
  const [copied, setCopied] = useState(false);
  
  const { serviceDays, musicians, instruments } = store;

  const handleDayClick = (day: Date) => {
    const isoStr = format(day, 'yyyy-MM-dd');
    const existingService = serviceDays.find((d: ServiceDay) => d.id === isoStr);
    setSelectedDayToEdit(existingService || {...serviceDayFormat, id: isoStr});
    
    setShowEventEditor(true)
  };

  const parseLocalDate = (isoStr: string) => {
    const [year, month, day] = isoStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const getMusicianName = (id: string) => {
    const m = musicians.find((m: Musician) => m.id === id);
    return m ? `${m.name}` : '---';
  };

  const getInstrumentName = (id: string) => {
    const i = instruments.find((i: Instrument) => i.id === id);
    return i ? i.name : 'Inst';
  };

  const getList = (ids: string[]) => {
    if (ids.length === 1) return getMusicianName(ids[0])
    let firstIds = ids.map(id => id)
    const lastId = firstIds.pop() || ''
    return firstIds.map(id => getMusicianName(id)).join(', ') + ' y ' + getMusicianName(lastId)
  };

  const handleSendSchedule = async () => {
    const monthName = format(currentDate, 'MMMM', { locale: 'ES' }).toUpperCase();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const filteredDays = serviceDays
      .filter((s: ServiceDay) => {
        const d = parseLocalDate(s.id);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .sort((a: ServiceDay, b: ServiceDay) => a.id.localeCompare(b.id));

    if (filteredDays.length === 0) {
      alert("No hay días programados para este mes en el organigrama.");
      return;
    }

    let text = `*DIRIGEN EN ${monthName}:*\n`;
    filteredDays.forEach((s: ServiceDay) => {
      const d = parseLocalDate(s.id);
      const dayName = format(d, 'EEEE', { locale: 'ES' });
      const dayNum = format(d, 'd');
      const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

      const directorsList = getList(s.directors)
      
      text += `*${capitalizedDay} ${dayNum}:* _${directorsList !== ' y ---' ? directorsList : 'Pendiente'}_\n`;
    });

    await Clipboard.setStringAsync(text.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Error al copiar: ', err);
      Alert.alert("No se pudo copiar el texto. Inténtalo de nuevo.");
    });
  };

  return (
    <View className="p-4 pb-0 flex-1">
      <Tabs 
        tabs={[
          {
            key: 'calendar',
            label: 'Calendario',
            icon: <Feather name="calendar" size={28}/>
          },
          {
            key: 'list',
            label: 'Lista',
            icon: <Feather name="list" size={28}/>
          }
        ]}
        activeTab={activeSection}
        onChange={setActiveSection}
      />

      <View className="space-y-4 gap-4 mb-4">
        <View className='flex flex-row justify-between items-center'>
          <Pressable 
            onPress = {() => {
            }}
            className='p-2 bg-indigo-600 rounded-full shadow-lg transition-transform active:scale-90 flex intms-center justify-center'
          >
            <Feather name="plus" size={24} color={'#fff'} />
          </Pressable>
        </View>
      </View>

      <ScrollView>
        {activeSection === 'calendar'
          ? (
            <Calendar 
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              eventDays={serviceDays.map((day: ServiceDay) => ({ 
                date: day.id, 
                title: musicians
                  .filter((m: Musician) => day.directors.includes(m.id))
                  .map((m: Musician) => m.name)
              }))}
              handleDayClick={handleDayClick}
            >
              <Pressable
                onPress={handleSendSchedule}
                className={`px-6 py-2.5 rounded-full flex-row justify-center items-center gap-2 shadow-md transition-all active:scale-95 ${copied ? 'bg-green-500' : 'bg-indigo-600 active:bg-indigo-700'}`}
              >
                {copied ? (
                  <>
                    <Text className='text-white'><Feather name='check' size={20} /></Text>
                    <Text className='text-white font-bold'>¡Copiado!</Text>
                  </>
                ) : (
                  <>
                    <Text className='text-white'><Feather name='copy' size={20} /></Text>
                    <Text className='text-white font-bold'>Copiar Cronograma</Text>
                  </>
                )}
              </Pressable>
            </Calendar>
          )
          : (
            <View className="space-y-4">
              {
                serviceDays.length === 0
                  ? (
                    <View className="py-10">
                      <Text className="mx-auto mb-2 opacity-20"><Feather name='music' size={48} /></Text>
                      <Text className="text-sm text-gray-400 font-medium text-center">No hay reuniones programadas</Text>
                    </View>
                  )
                  : (
                    [...serviceDays]
                      .sort((a: any, b: any) => a.id.localeCompare(b.id))
                      .map((service: ServiceDay) => {
                        const dateObj = parseLocalDate(service.id);
                        return (
                          <Pressable 
                            key={service.id} 
                            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all active:scale-[0.99] group"
                            onPress={() => handleDayClick(dateObj)}
                          >
                            <View className="flex items-start justify-between pb-4 border-b border-gray-100">
                              <View className="flex-row items-center justify-center gap-4">
                                <View className="bg-gray-50 p-2 rounded-xl min-w-[50px]">
                                  <Text className="text-center text-[12px] font-black text-indigo-600 uppercase">{format(dateObj, 'eee', { locale: 'ES' })}</Text>
                                  <Text className="text-center text-2xl font-black text-gray-800 leading-none mt-1">{format(dateObj, 'dd')}</Text>
                                </View>
                                <View>
                                  <Text className="font-bold text-xl text-gray-800">{service.title || 'Reunión Gral.'}</Text>
                                  <Text className="text-xs text-gray-400">{format(dateObj, "MMMM 'de' yyyy", { locale: 'ES' })}</Text>
                                </View>
                              </View>
                            </View>

                            {/* Detailed Organization */}
                            <View className="flex gap-2 space-y-3 pl-2 m-2">
                              {service.directors.length > 0 && (
                                <View className="flex-row items-start gap-3">
                                  <Text className="mt-1 text-indigo-500"><Feather name='user' size={18} /></Text>
                                  <View>
                                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-tight">Dirige{`${service.directors.length !== 1 ? 'n' : ''}`}:</Text>
                                    <Text className="text-sm font-semibold text-gray-700">{getList(service.directors)}</Text>
                                  </View>
                                </View>
                              )}

                              {service.singers.length > 0 && (
                                <View className="flex-row items-start gap-3">
                                  <Text className="mt-1 text-pink-500"><Feather name='mic' size={18} /></Text>
                                  <View>
                                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-tight">Canta{`${service.singers.length !== 1 ? 'n' : ''}`}:</Text>
                                    <Text className="text-sm font-medium text-gray-600">{getList(service.singers)}</Text>
                                  </View>
                                </View>
                              )}

                              {service.instrumentalists.length > 0 && (
                                <View className="flex-row items-start gap-3">
                                  <Text className="mt-1 text-amber-500"><Feather name='music' size={18} /></Text>
                                  <View className="flex-1">
                                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-tight">Instrumentos:</Text>
                                    <View className="grid grid-cols-1 gap-1 mt-1">
                                      {service.instrumentalists.map((inst: any, idx: number) => (
                                        <View key={idx} className="flex-row gap-2 text-sm px-2 py-1">
                                          <Text className="text-sm font-medium text-gray-500">{getInstrumentName(inst.instrumentId)}:</Text>
                                          <Text className="text-sm font-bold text-gray-700">{getMusicianName(inst.musicianId)}</Text>
                                        </View>
                                      ))}
                                    </View>
                                  </View>
                                </View>
                              )}

                              {service.directors.length === 0 && service.singers.length === 0 && service.instrumentalists.length === 0 && (
                                <Text className="text-xs text-amber-500 font-medium italic">Pendiente de organización</Text>
                              )}
                            </View>
                          </Pressable>
                        );
                      })
                  )
              }
            </View>
          )
        }
      </ScrollView>
      <EventEditor 
        showEventEditor={showEventEditor}
        setShowEventEditor={setShowEventEditor} 
        selectedDayToEdit={selectedDayToEdit} 
        setSelectedDayToEdit={setSelectedDayToEdit}
        store={store} 
      />
    </View>
  );
};

export default CalendarView;