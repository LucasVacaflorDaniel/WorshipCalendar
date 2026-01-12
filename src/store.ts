
import { useState, useEffect } from 'react';
import { Musician, Instrument, ServiceDay } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as myUUID } from 'uuid';

export const MONTHS = [
  { id: 0, name: 'enero'},
  { id: 1, name: 'febrero'},
  { id: 2, name: 'marzo'},
  { id: 3, name: 'abril'},
  { id: 4, name: 'mayo'},
  { id: 5, name: 'junio'},
  { id: 6, name: 'julio'},
  { id: 7, name: 'agosto'},
  { id: 8, name: 'septiembre'},
  { id: 9, name: 'octubre'},
  { id: 10, name: 'noviembre'},
  { id: 11, name: 'diciembre'},

]

const INITIAL_MUSICIANS: Musician[] = [
  { id: 'm1', name: 'Cintia Lopez', active: true },
  { id: 'm2', name: 'Celeste Elso', active: true },
  { id: 'm3', name: 'Esteban Elso', active: true },
  { id: 'm4', name: 'Gonzalo Elso', active: true },
  { id: 'm5', name: 'Javier Ibarra', active: true },
  { id: 'm6', name: 'Jonathan Lopez', active: true },
  { id: 'm7', name: 'Marta marta', active: true },
  { id: 'm8', name: 'Noelia Ibarra', active: true },
  { id: 'm9', name: 'Sacha Pulsoni', active: true },
  { id: 'm10', name: 'Sandra Sotelo', active: true },
  { id: 'm11', name: 'Sofia Murisengo', active: true },
  { id: 'm12', name: 'Yesica yesica', active: true },
  { id: 'm13', name: 'Lucas Vacaflor', active: true },
];

const INITIAL_INSTRUMENTS: Instrument[] = [
  { id: 'i1', name: 'Guitarra A.', active: true },
  { id: 'i2', name: 'Guitarra E.', active: true },
  { id: 'i3', name: 'Piano', active: true },
  { id: 'i4', name: 'Bajo', active: true },
  { id: 'i5', name: 'Bateria', active: true },
];

const INITIAL_SERVICE_DAYS: ServiceDay[] = [
  { id: '2026-01-10', directors: [], singers: [], instrumentalists: [] },{ id: '2026-01-11', directors: ['m1','m13'], singers: ['m3', 'm7'], instrumentalists: [ { musicianId: 'm2', instrumentId: 'i1' }, { musicianId: 'm4', instrumentId: 'i2' } ] },
];

export const useStore = () => {
  const [musicians, setMusicians] = useState<Musician[]>(INITIAL_MUSICIANS);
  const [instruments, setInstruments] = useState<Instrument[]>(INITIAL_INSTRUMENTS);
  const [serviceDays, setServiceDays] = useState<ServiceDay[]>(INITIAL_SERVICE_DAYS);

  useEffect(() => {
    const loadStore = async () => {
      const savedMusicians = await AsyncStorage.getItem('church_musicians');
      const savedInstruments = await AsyncStorage.getItem('church_instruments');
      const savedServices = await AsyncStorage.getItem('church_services');

      if (savedMusicians) {
        setMusicians(JSON.parse(savedMusicians));
      }

      if (savedInstruments) {
        setInstruments(JSON.parse(savedInstruments));
      }

      if (savedServices) {
        setServiceDays(JSON.parse(savedServices));
      }
    };

  loadStore();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('church_musicians', JSON.stringify(musicians));
  }, [musicians]);

  useEffect(() => {
    AsyncStorage.setItem('church_instruments', JSON.stringify(instruments));
  }, [instruments]);

  useEffect(() => {
    AsyncStorage.setItem('church_services', JSON.stringify(serviceDays));
  }, [serviceDays]);

  const addMusician = (name: string) => {
    setMusicians(prev => [...prev, { id: myUUID(), name, active: true }]);
  };

  const updateMusician = (id: string, name: string) => {
    setMusicians(prev => prev.map(m => m.id === id ? { ...m, name } : m));
  };

  const toggleMusician = (id: string) => {
    setMusicians(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const deleteMusician = (id: string) => {
    setMusicians(prev => prev.filter(m => m.id !== id));
  }

  const addInstrument = (name: string) => {
    setInstruments(prev => [...prev, { id: myUUID(), name, active: true }]);
  };

  const updateInstrument = (id: string, name: string) => {
    setInstruments(prev => prev.map(i => i.id === id ? { ...i, name } : i));
  };

  const toggleInstrument = (id: string) => {
    setInstruments(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));
  };

  const deleteInstrument = (id: string) => {
    setInstruments(prev => prev.filter(i => i.id !== id));
  }

  const upsertServiceDay = (day: ServiceDay) => {
    setServiceDays(prev => {
      const exists = prev.find(d => d.id === day.id);
      if (exists) {
        return prev.map(d => d.id === day.id ? day : d);
      }
      return [...prev, day];
    });
  };

  const deleteServiceDay = (id: string) => {
    setServiceDays(prev => prev.filter(d => d.id !== id));
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return {
    musicians,
    instruments,
    serviceDays,
    addMusician,
    updateMusician,
    toggleMusician,
    deleteMusician,
    addInstrument,
    updateInstrument,
    toggleInstrument,
    deleteInstrument,
    upsertServiceDay,
    deleteServiceDay,
    getInitials,
  };
};
