import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { checklistData } from '../utils/parsedChecklist';
import { parseExcelToChecklist } from '../utils/parseExcel';

type Props = NativeStackScreenProps<RootStackParamList, 'Главная'>;

export default function HomeScreen({ navigation }: Props) {
  const loadFromTemplate = () => {
    navigation.navigate('Чек-лист', { checklist: checklistData });
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    });

    if (result.assets && result.assets.length > 0) {
      const fileUri = result.assets[0].uri;
      const checklist = await parseExcelToChecklist(fileUri);
      navigation.navigate('Чек-лист', { checklist });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите источник чек-листа</Text>
      <Button title="📄 Использовать шаблон" onPress={loadFromTemplate} />
      <View style={{ height: 20 }} />
      <Button title="📂 Загрузить Excel" onPress={pickDocument} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 18, marginBottom: 20 },
});