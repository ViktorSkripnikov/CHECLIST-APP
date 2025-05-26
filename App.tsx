import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ChecklistScreen from './screens/ChecklistScreen';
import { ChecklistSection } from './utils/parsedChecklist';

export type RootStackParamList = {
  Главная: undefined;
  "Чек-лист": { checklist: ChecklistSection[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Главная" component={HomeScreen} />
        <Stack.Screen name="Чек-лист" component={ChecklistScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}