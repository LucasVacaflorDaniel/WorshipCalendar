import { Tabs } from "expo-router";
import { Feather } from '@expo/vector-icons'
import 'react-native-get-random-values';

import '../global.css';

import Header from "components/Header";

export default function Layout() {

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#4f46e5',
      tabBarInactiveTintColor: '#9ca3af',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          header: () => <Header />,
          tabBarLabel: 'Organigrama',
          tabBarIcon: ({color}) => <Feather name="calendar" size={24} color={color} />,
        }}
        />
      <Tabs.Screen
        name="Musicians"
        options={{
          header: () => <Header />,
          tabBarLabel: 'Músicos',
          tabBarIcon: ({color}) => <Feather name="users" size={24} color={color} />
        }}
        />
    </Tabs>
  )
}