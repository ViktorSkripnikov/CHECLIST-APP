import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ChecklistScreen from './src/screens/ChecklistScreen/ChecklistScreen'; // Обновленный путь
import { ChecklistSection } from './src/utils/parsedChecklist';

export type RootStackParamList = {
  Главная: undefined;
  "Чек-лист": { checklist: ChecklistSection[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Главная" 
          component={HomeScreen} 
          options={{ title: 'Главный экран' }} // Опционально
        />
        <Stack.Screen 
          name="Чек-лист" 
          component={ChecklistScreen}
          options={{ title: 'Проверочный лист' }} // Опционально
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}