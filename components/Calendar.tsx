import React from "react";
import { Feather } from '@expo/vector-icons'
import { Text, Pressable, View } from 'react-native';
import { format , subMonths, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth } from "../src/dates";

type DayEvent = {
  date: string | Date;
  title: string[];
}

interface CalendarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  eventDays?: DayEvent[];
  handleDayClick?: (date: Date) => void;
  children?: React.ReactNode;
};

const Calendar = ({
  currentDate,
  setCurrentDate,
  eventDays = [],
  handleDayClick = () => {},
  children,
}: CalendarProps) => {

  const toDayKey = (date: string | Date) =>
  typeof date === 'string'
    ? date.slice(0, 10)
    : format(date, 'yyyy-MM-dd')
  
  const getEventForDay = <T extends DayEvent>(
    day: Date,
    eventDays: T[]
  ): T | undefined => {
    const key = toDayKey(day)
    return eventDays.find(e => toDayKey(e.date) === key)
  }

  const chunkArray = <T,>(array: T[], size: number): T[][] => {
    const result: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size))
    }
    return result
  }

   // Calendar Logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weeks = chunkArray(calendarDays, 7)


  return (
    <View className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Calendar Header */}
      <View className="p-4 flex-row items-center justify-between border-b border-gray-100">
          <Pressable onPress={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 active:bg-gray-50 rounded-lg">
              <Text className="text-gray-400"><Feather name="chevron-left" size={30} /></Text>
          </Pressable>
          <Text className="text-xl font-bold text-gray-800 capitalize">{format(currentDate, 'mmmm yyyy', { locale: 'ES' })}</Text>
          <Pressable onPress={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 active:bg-gray-50 rounded-lg">
              <Text className="text-gray-400"><Feather name="chevron-right" size={30} /></Text>
          </Pressable>
      </View>

      {/* Weekdays */}
      <View className="flex flex-row border-b border-gray-100 bg-gray-50">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
          <Text key={idx} className="py-2 text-center flex-1 font-bold text-indigo-600">{day}</Text>
        ))}
      </View>

      {/* Grid */}
      <View>
        {weeks.map((week, weekIdx) => (
          <View key={weekIdx} className="flex-row">
            {week.map((day, idx) => {
              const event = getEventForDay(day.date, eventDays)
              const isSelectedMonth = isSameMonth(day.date, monthStart);
              const isTodayDay = day.isCurrentDay

              return (
                <Pressable
                  key={idx}
                  onPress={() => handleDayClick(day.date)}
                  className={`flex-1 min-h-24 p-1 border-b border-r border-gray-100 active:bg-gray-100 active:border-gray-200 ${
                    !isSelectedMonth ? 'bg-gray-50/50' : 'bg-white'
                  }`}
                >
                  <Text
                    className={`font-semibold text-center align-middle w-6 h-6 rounded-full ${
                      isTodayDay
                      ? 'bg-indigo-600 text-x font-bold text-white'
                      : isSelectedMonth
                      ? 'text-gray-700 text-xs'
                      : 'text-gray-300 text-xs'
                    }`}
                  >{format(day.date, 'd')}</Text>
                  {event && event.title.length > 0 && (
                    <View className="mt-1 w-full">
                      {event.title.map((name, idx) => (
                        <Text
                          key={idx}
                          numberOfLines={1}
                          className="bg-indigo-50 text-indigo-700 text-xs px-1 py-0.5 rounded border border-indigo-100 font-bold"
                        >{name}</Text>
                      ))}

                      <View className="mt-1 h-0.5 w-full bg-indigo-500 rounded-full" />
                    </View>
                  )}

                  {event && event.title.length === 0 && (
                    <View className="mt-1 w-full">
                      <Text className="text-xs text-gray-400 italic px-1">Pendiente</Text>
                    </View>
                  )}
                </Pressable>
              )
            })}
          </View>
        ))}
      </View>
      <View className="p-4 flex justify-center">
        {children}
      </View>
    </View>
  )
}

export default Calendar;