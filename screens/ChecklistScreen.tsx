// screens/ChecklistScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Button, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { ChecklistSection } from '../utils/parsedChecklist';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { WebView } from 'react-native-webview';

type Props = NativeStackScreenProps<RootStackParamList, 'Чек-лист'>;

const ANSWERS = ['Да', 'Нет', 'Н/П'];

export default function ChecklistScreen({ route }: Props) {
  const [data, setData] = useState<ChecklistSection[]>(route.params.checklist);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

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
  };

  const handleExportToFile = async () => {
    try {
      const filename = `checklist-result-${Date.now()}.json`;
      const path = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(path, JSON.stringify(data, null, 2), {
        encoding: FileSystem.EncodingType.UTF8,
      });
      alert(`✅ Чек-лист сохранён:\n${path}`);
    } catch (error) {
      alert('Ошибка при сохранении файла');
    }
  };

  const handleShareFile = async () => {
    try {
      const filename = `checklist-${Date.now()}.json`;
      const path = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(path, JSON.stringify(data, null, 2));
      await Sharing.shareAsync(path);
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      alert('Не удалось поделиться файлом');
    }
  };

  const generatePdf = async () => {
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: sans-serif; font-size: 12px; padding: 10px; }
            h1 { font-size: 18px; }
            h2 { font-size: 14px; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            td, th { border: 1px solid #ccc; padding: 4px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Отчет по чек-листу</h1>
          ${data.map(section => `
            <h2>${section.section}</h2>
            ${section.items.map(item => `
              <strong>${item.id}. ${item.question}</strong>
              <table>
                <tr><th>№</th><th>Вопрос</th><th>Ответ</th><th>Комментарий</th></tr>
                ${item.subitems.map(sub => `
                  <tr>
                    <td>${sub.id}</td>
                    <td>${sub.question}</td>
                    <td>${sub.answer ?? '-'}</td>
                    <td>${sub.comment || '-'}</td>
                  </tr>
                `).join('')}
              </table>
            `).join('')}
          `).join('')}
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      setPdfUri(uri);
      setPreviewVisible(true);
    } catch (error) {
      console.error('Ошибка PDF:', error);
      alert('Не удалось создать PDF-файл');
    }
  };

  const uploadToServer = async () => {
    try {
      const response = await fetch('https://your-server.com/upload-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: `checklist-${Date.now()}.json`,
          content: data,
        }),
      });
      const res = await response.json();
      alert('Загружено успешно!');
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Ошибка загрузки на сервер');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal visible={previewVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          {pdfUri && <WebView source={{ uri: pdfUri }} style={{ flex: 1 }} />}
          <Button title="📤 Отправить PDF" onPress={() => {
            setPreviewVisible(false);
            Sharing.shareAsync(pdfUri!);
          }} />
          <Button title="❌ Закрыть просмотр" onPress={() => setPreviewVisible(false)} />
        </View>
      </Modal>

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
                      {ANSWERS.map(ans => (
                        <TouchableOpacity
                          key={ans}
                          style={[styles.answerBtn, sub.answer === ans && styles.selectedAnswer]}
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
        <Button title="📄 Просмотреть PDF перед отправкой" onPress={generatePdf} />
        <Button title="📤 Поделиться JSON-файлом" onPress={handleShareFile} />
        <Button title="💾 Сохранить в JSON-файл" onPress={handleExportToFile} />
      </ScrollView>
    </View>
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
    borderRadius: 5,
  },
  selectedAnswer: {
    backgroundColor: '#cce5cc',
    borderColor: '#4CAF50',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 6,
    borderRadius: 5,
  },
});
