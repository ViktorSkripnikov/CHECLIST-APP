import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { checklistData, ChecklistSection } from '../utils/parsedChecklist';


const ANSWERS = ['Да', 'Нет', 'Н/П'];

export default function ChecklistScreen() {
  const [data, setData] = useState<ChecklistSection[]>(checklistData);

  const handleAnswer = (sectionIdx: number, itemIdx: number, subIdx: number, answer: string) => {
    const newData = [...data];
    newData[sectionIdx].items[itemIdx].subitems[subIdx].answer = answer;
    setData(newData);
  };

  const handleComment = (sectionIdx: number, itemIdx: number, subIdx: number, text: string) => {
    const newData = [...data];
    newData[sectionIdx].items[itemIdx].subitems[subIdx].comment = text;
    setData(newData);
  };

  const handleSave = () => {
    console.log(JSON.stringify(data, null, 2));
    // В будущем: сохранить в файл, отправить, или сохранить в AsyncStorage
  };


  const handleExportToFile = async () => {
    try {
      const filename = `checklist-result-${Date.now()}.json`;
      const path = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(path, JSON.stringify(data, null, 2), {
        encoding: FileSystem.EncodingType.UTF8
      });
      console.log(`Файл сохранён: ${path}`);
      alert(`✅ Чек-лист сохранён:\n${path}`);
    } catch (error) {
      console.error('Ошибка сохранения файла:', error);
      alert('Ошибка при сохранении файла');
    }
  };
  
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {data.map((section, sectionIdx) => (
        <View key={sectionIdx} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.section}</Text>
          {section.items.map((item, itemIdx) => (
            <View key={item.id}>
              <Text style={styles.itemTitle}>{item.id}. {item.question}</Text>
              {item.subitems.map((sub, subIdx) => (
                <View key={sub.id} style={styles.subitem}>
                  <Text>{sub.id}. {sub.question}</Text>
                  <View style={styles.answerRow}>
                    {ANSWERS.map((ans) => (
                      <TouchableOpacity
                        key={ans}
                        style={[
                          styles.answerBtn,
                          sub.answer === ans && styles.selectedAnswer
                        ]}
                        onPress={() => handleAnswer(sectionIdx, itemIdx, subIdx, ans)}
                      >
                        <Text>{ans}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TextInput
                    placeholder="Комментарий"
                    value={sub.comment}
                    onChangeText={(text) => handleComment(sectionIdx, itemIdx, subIdx, text)}
                    style={styles.input}
                    multiline
                  />
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
      <Button title="Сохранить" onPress={handleSave} />
      <Button title="Сохранить в JSON-файл" onPress={handleExportToFile} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  itemTitle: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  subitem: { marginVertical: 10 },
  answerRow: { flexDirection: 'row', marginVertical: 5 },
  answerBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 8,
    borderRadius: 5
  },
  selectedAnswer: {
    backgroundColor: '#cce5cc',
    borderColor: '#4CAF50'
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 6,
    borderRadius: 5
  }
});


