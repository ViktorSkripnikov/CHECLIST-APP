// screens/ChecklistScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
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
  // Состояния компонента
  const [data, setData] = useState<ChecklistSection[]>(route.params.checklist);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

// Проверка разрешений (исправленная)
useEffect(() => {
  const checkPermissions = async () => {
    try {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      setHasPermission(permissions.granted);
    } catch (error) {
      console.error('Ошибка проверки разрешений:', error);
      setHasPermission(false);
    }
  };
  checkPermissions();
}, []);

  /**
   * Генерирует HTML-контент для PDF
   */
  const generateHtmlContent = (): string => {
    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { 
              font-family: sans-serif; 
              font-size: 12px; 
              margin: 20px; /* Добавлено вместо padding */
            }
            /* остальные стили */
          </style>
        </head>
        <body>
          <!-- содержимое -->
        </body>
      </html>
    `;
  };

  /**
   * Обновляет ответ на вопрос
   */
  const handleAnswer = (
    sectionIdx: number,
    itemIdx: number,
    subIdx: number,
    answer: string
  ) => {
    const newData = [...data];
    newData[sectionIdx].items[itemIdx].subitems[subIdx].answer = answer;
    setData(newData);
  };

  /**
   * Обновляет комментарий к вопросу
   */
  const handleComment = (
    sectionIdx: number,
    itemIdx: number,
    subIdx: number,
    text: string
  ) => {
    const newData = [...data];
    newData[sectionIdx].items[itemIdx].subitems[subIdx].comment = text;
    setData(newData);
  };

  /**
   * Сохраняет данные в консоль (для отладки)
   */
  const handleSave = () => {
    console.log('Данные чек-листа:', JSON.stringify(data, null, 2));
    Alert.alert('Данные сохранены', 'Проверьте консоль для просмотра');
  };

  /**
   * Экспортирует данные в JSON файл
   */
  const handleExportToFile = async () => {
    if (!hasPermission) {
      Alert.alert('Ошибка', 'Нет разрешения на сохранение файлов');
      return;
    }

    setIsProcessing(true);
    try {
      const filename = `checklist-result-${Date.now()}.json`;
      const path = FileSystem.documentDirectory + filename;
      
      await FileSystem.writeAsStringAsync(
        path, 
        JSON.stringify(data, null, 2),
        { encoding: FileSystem.EncodingType.UTF8 }
      );
      
      Alert.alert(
        'Успех', 
        `Чек-лист сохранён в файл: ${filename}`,
        [{ text: 'OK', onPress: () => Sharing.shareAsync(path) }]
      );
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить файл');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Генерирует и показывает PDF
   */
  
// Генерация PDF (исправленная)
    const generatePdf = async () => {
      setIsProcessing(true);
      try {
        const { uri } = await Print.printToFileAsync({
          html: generateHtmlContent(),
          width: 595,   // A4 width in pixels (72dpi)
          height: 842,  // A4 height
          // padding параметр удален, так как не поддерживается
        });

        setPdfUri(uri);
        setPreviewVisible(true);
      } catch (error) {
        console.error('Ошибка генерации PDF:', error);
        Alert.alert('Ошибка', 'Не удалось создать PDF');
      } finally {
        setIsProcessing(false);
      }
    };
    
  

  /**
   * Отправляет JSON файл
   */
  const handleShareFile = async () => {
    setIsProcessing(true);
    try {
      if (!(await Sharing.isAvailableAsync())) {
        throw new Error('Функция отправки недоступна');
      }

      const filename = `checklist-${Date.now()}.json`;
      const path = FileSystem.documentDirectory + filename;
      
      await FileSystem.writeAsStringAsync(
        path, 
        JSON.stringify(data, null, 2)
      );
      
      await Sharing.shareAsync(path);
    } catch (error) {
      console.error('Ошибка отправки:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось отправить файл');
    } finally {
      setIsProcessing(false);
    }
  };

  // Стили компонента
  const styles = StyleSheet.create({
    container: { padding: 20 },
    section: { marginBottom: 25 },
    sectionTitle: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      marginBottom: 10,
      color: '#333'
    },
    itemTitle: { 
      fontSize: 16, 
      fontWeight: '600', 
      marginTop: 10,
      color: '#444'
    },
    subitem: { 
      marginVertical: 10,
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 5,
      elevation: 1
    },
    answerRow: { 
      flexDirection: 'row', 
      marginVertical: 5,
      justifyContent: 'space-around'
    },
    answerBtn: {
      padding: 8,
      borderWidth: 1,
      borderColor: '#999',
      borderRadius: 5,
      minWidth: 60,
      alignItems: 'center'
    },
    selectedAnswer: {
      backgroundColor: '#e0f7fa',
      borderColor: '#00bcd4'
    },
    input: {
      borderColor: '#ddd',
      borderWidth: 1,
      padding: 8,
      borderRadius: 5,
      marginTop: 5,
      backgroundColor: '#f9f9f9'
    },
    processingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    },
    buttonContainer: {
      marginVertical: 10
    }
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Модальное окно предпросмотра PDF */}
      <Modal visible={previewVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          {pdfUri ? (
            <>
              <WebView 
                source={{ uri: pdfUri }} 
                style={{ flex: 1 }}
                startInLoadingState={true}
                renderLoading={() => (
                  <View style={styles.processingContainer}>
                    <ActivityIndicator size="large" color="#00bcd4" />
                  </View>
                )}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                <Button
                  title="📤 Отправить"
                  onPress={async () => {
                    try {
                      if (!pdfUri) throw new Error('PDF не готов');
                      await Sharing.shareAsync(pdfUri);
                    } catch (error) {
                      Alert.alert('Ошибка', error.message || 'Не удалось отправить');
                    }
                  }}
                  color="#4CAF50"
                />
                <Button
                  title="❌ Закрыть"
                  onPress={() => setPreviewVisible(false)}
                  color="#F44336"
                />
              </View>
            </>
          ) : (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#00bcd4" />
              <Text style={{ marginTop: 10 }}>Подготовка PDF...</Text>
            </View>
          )}
        </View>
      </Modal>

      {/* Основной интерфейс */}
      <ScrollView contentContainerStyle={styles.container}>
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#00bcd4" />
            <Text style={{ marginTop: 10 }}>Обработка данных...</Text>
          </View>
        )}

        {data.map((section, sectionIdx) => (
          <View key={`section-${sectionIdx}`} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            {section.items.map((item, itemIdx) => (
              <View key={`item-${item.id}`}>
                <Text style={styles.itemTitle}>{item.id}. {item.question}</Text>
                {item.subitems.map((sub, subIdx) => (
                  <View key={`subitem-${sub.id}`} style={styles.subitem}>
                    <Text>{sub.id}. {sub.question}</Text>
                    <View style={styles.answerRow}>
                      {ANSWERS.map(ans => (
                        <TouchableOpacity
                          key={`answer-${ans}`}
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
                      placeholder="Введите комментарий..."
                      placeholderTextColor="#999"
                      value={sub.comment}
                      onChangeText={text => handleComment(sectionIdx, itemIdx, subIdx, text)}
                      style={styles.input}
                      multiline
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}

        {/* Кнопки управления */}
        <View style={styles.buttonContainer}>
          <Button
            title="Сохранить в консоль"
            onPress={handleSave}
            disabled={isProcessing}
            color="#607D8B"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isProcessing ? "Генерация PDF..." : "📄 Предпросмотр PDF"}
            onPress={generatePdf}
            disabled={isProcessing}
            color="#009688"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="📤 Поделиться JSON"
            onPress={handleShareFile}
            disabled={isProcessing}
            color="#2196F3"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="💾 Сохранить в файл"
            onPress={handleExportToFile}
            disabled={isProcessing || !hasPermission}
            color="#673AB7"
          />
        </View>
      </ScrollView>
    </View>
  );
}