// screens/ChecklistScreen.tsx
// Импортируем необходимые компоненты и библиотеки
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Button, Modal, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { ChecklistSection } from '../utils/parsedChecklist';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

// Определяем тип пропсов для экрана
type Props = NativeStackScreenProps<RootStackParamList, 'Чек-лист'>;

// Варианты ответов для чек-листа
const ANSWERS = ['Да', 'Нет', 'Н/П'];

// Основной компонент экрана чек-листа
export default function ChecklistScreen({ route }: Props) {
    // Состояние для хранения данных чек-листа (получаем из параметров навигации)
  const [data, setData] = useState<ChecklistSection[]>(route.params.checklist);
   // Состояние для отслеживания процесса генерации PDF
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // Обработчик выбора ответа
  const handleAnswer = (sectionIdx: number, itemIdx: number, subIdx: number, answer: string) => {
    // Создаем копию данных (чтобы не мутировать исходное состояние)
    const newData = [...data];
    // Обновляем выбранный ответ в копии данных
    newData[sectionIdx].items[itemIdx].subitems[subIdx].answer = answer;
    // Устанавливаем обновленные данные
    setData(newData);
  };

  // Обработчик ввода комментария
  const handleComment = (sectionIdx: number, itemIdx: number, subIdx: number, text: string) => {
    // Аналогично обработчику ответа, но для комментария
    const newData = [...data];
    newData[sectionIdx].items[itemIdx].subitems[subIdx].comment = text;
    setData(newData);
  };

  // Просто выводит данные в консоль (для отладки)
  const handleSave = () => {
    console.log(JSON.stringify(data, null, 2));
  };
  // Сохраняет данные чек-листа в файл JSON
  const handleExportToFile = async () => {
    try {
      // Создаем уникальное имя файла с текущей меткой времени
      const filename = `checklist-result-${Date.now()}.json`;
      // Формируем полный путь к файлу
      const path = FileSystem.documentDirectory + filename;
      // Записываем данные в файл (в формате JSON)
      await FileSystem.writeAsStringAsync(path, JSON.stringify(data, null, 2), {
        encoding: FileSystem.EncodingType.UTF8,
      });
      // Показываем уведомление об успешном сохранении
      alert(`✅ Чек-лист сохранён:\n${path}`);
    } catch (error) {
      alert('Ошибка при сохранении файла');
    }
  };
  // Отправляет файл через стандартный механизм "поделиться" на устройстве
  const handleShareFile = async () => {
    try {
      const filename = `checklist-${Date.now()}.json`;
      const path = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(path, JSON.stringify(data, null, 2));
      // Открываем диалог "поделиться"
      await Sharing.shareAsync(path);
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      alert('Не удалось поделиться файлом');
    }
  };

  // Генерация PDF отчета
  const generatePdf = async () => {
    // Устанавливаем флаг генерации (для отображения индикатора)
    setIsGeneratingPdf(true);
    
    // Формируем HTML-контент для PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              font-size: 12px; 
              padding: 20px; 
              margin: 0;
              line-height: 1.4;
            }
            h1 { 
              font-size: 20px; 
              color: #333;
              text-align: center;
              margin-bottom: 30px;
            }
            h2 { 
              font-size: 16px; 
              margin-top: 25px; 
              margin-bottom: 15px;
              color: #2c3e50;
              border-bottom: 2px solid #3498db;
              padding-bottom: 5px;
            }
            .item-title {
              font-weight: bold;
              margin-top: 15px;
              margin-bottom: 10px;
              color: #34495e;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 10px 0 20px 0;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            th {
              background-color: #f8f9fa;
              border: 1px solid #dee2e6;
              padding: 8px;
              text-align: left;
              font-weight: bold;
              color: #495057;
            }
            td { 
              border: 1px solid #dee2e6; 
              padding: 6px 8px; 
              text-align: left; 
              vertical-align: top;
            }
            .answer-yes { background-color: #d4edda; }
            .answer-no { background-color: #f8d7da; }
            .answer-na { background-color: #fff3cd; }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #6c757d;
              font-size: 10px;
              border-top: 1px solid #dee2e6;
              padding-top: 15px;
            }
          </style>
        </head>
        <body>
          <h1>Отчет по чек-листу проверки предприятия</h1>
          ${data.map(section => `
            <h2>${section.section}</h2>
            ${section.items.map(item => `
              <div class="item-title">${item.id}. ${item.question}</div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 8%;">№</th>
                    <th style="width: 50%;">Вопрос</th>
                    <th style="width: 12%;">Ответ</th>
                    <th style="width: 30%;">Комментарий</th>
                  </tr>
                </thead>
                <tbody>
                  ${item.subitems.map(sub => `
                    <tr>
                      <td>${sub.id}</td>
                      <td>${sub.question}</td>
                      <td class="${
                        sub.answer === 'Да' ? 'answer-yes' : 
                        sub.answer === 'Нет' ? 'answer-no' : 
                        sub.answer === 'Н/П' ? 'answer-na' : ''
                      }">${sub.answer || '-'}</td>
                      <td>${sub.comment || '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `).join('')}
          `).join('')}
          <div class="footer">
            Дата создания отчета: ${new Date().toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </body>
      </html>
    `;

    try {
      // Генерируем PDF во временной папке
      const { uri: tempUri } = await Print.printToFileAsync({ 
        html: htmlContent,
        base64: false,
      });

      // Создаем имя файла с текущей датой
      const fileName = `checklist_report_${new Date().toISOString().split('T')[0]}_${Date.now()}.pdf`;
      
      // Копируем в постоянную папку документов
      const permanentUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({
        from: tempUri,
        to: permanentUri,
      });

      // Удаляем временный файл
      try {
        await FileSystem.deleteAsync(tempUri);
      } catch (deleteError) {
        console.log('Не удалось удалить временный файл:', deleteError);
      }

      setIsGeneratingPdf(false);

      // Показываем диалог с опциями
      Alert.alert(
        'PDF создан успешно',
        `Файл сохранен как: ${fileName}`,
        [
          {
            text: 'Поделиться',
            onPress: async () => {
              try {
                if (await Sharing.isAvailableAsync()) {
                  await Sharing.shareAsync(permanentUri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Поделиться PDF отчетом',
                  });
                } else {
                  Alert.alert('Ошибка', 'Функция "Поделиться" недоступна на этом устройстве');
                }
              } catch (shareError) {
                console.error('Ошибка при отправке:', shareError);
                Alert.alert('Ошибка', 'Не удалось поделиться файлом');
              }
            }
          },
          {
            text: 'Показать диалог печати',
            onPress: async () => {
              try {
                await Print.printAsync({
                  html: htmlContent,
                });
              } catch (printError) {
                console.error('Ошибка печати:', printError);
                Alert.alert('Ошибка', 'Не удалось открыть диалог печати');
              }
            }
          },
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );

    } catch (error) {
      setIsGeneratingPdf(false);
      console.error('Ошибка при создании PDF:', error);
      Alert.alert(
        'Ошибка', 
        'Не удалось создать PDF-файл. Проверьте доступное место на устройстве и попробуйте еще раз.',
        [{ text: 'OK' }]
      );
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

  // Рендер компонента
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Отображение структуры чек-листа */}
        {data.map((section, sectionIdx) => (
          <View key={sectionIdx} style={styles.section}>
            {/* Заголовок секции */}
            <Text style={styles.sectionTitle}>{section.section}</Text>
            
            {/* Вопросы в секции */}
            {section.items.map((item, itemIdx) => (
              <View key={item.id}>
                {/* Текст вопроса */}
                <Text style={styles.itemTitle}>{item.id}. {item.question}</Text>
                
                {/* Подвопросы */}
                {item.subitems.map((sub, subIdx) => (
                  <View key={sub.id} style={styles.subitem}>
                    {/* Текст подвопроса */}
                    <Text style={styles.questionText}>{sub.id}. {sub.question}</Text>
                    
                    {/* Варианты ответов (Да/Нет/НП) */}
                    <View style={styles.answerRow}>
                      {ANSWERS.map(ans => (
                        <TouchableOpacity
                          key={ans}
                          style={[styles.answerBtn, sub.answer === ans && styles.selectedAnswer]}
                          onPress={() => handleAnswer(sectionIdx, itemIdx, subIdx, ans)}
                        >
                          <Text style={[
                            styles.answerText,
                            sub.answer === ans && styles.selectedAnswerText
                          ]}>{ans}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    {/* Поле для комментария */}
                    <TextInput
                      placeholder="Добавить комментарий..."
                      value={sub.comment}
                      onChangeText={(text) => handleComment(sectionIdx, itemIdx, subIdx, text)}
                      style={styles.input}
                      multiline
                      numberOfLines={2}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
        
        {/* Кнопки действий */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>💾 Сохранить</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.pdfButton, isGeneratingPdf && styles.disabledButton]} 
            onPress={generatePdf}
            disabled={isGeneratingPdf}
          >
            <Text style={styles.buttonText}>
              {isGeneratingPdf ? '⏳ Создание PDF...' : '📄 Создать PDF отчет'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton} onPress={handleShareFile}>
            <Text style={styles.buttonText}>📤 Поделиться JSON</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.exportButton} onPress={handleExportToFile}>
            <Text style={styles.buttonText}>💾 Экспорт в файл</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20,
    paddingBottom: 40,
  },
  section: { 
    marginBottom: 25,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15,
    color: '#2c3e50',
  },
  itemTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginTop: 15,
    marginBottom: 10,
    color: '#34495e',
  },
  subitem: { 
    marginVertical: 12,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  questionText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#495057',
  },
  answerRow: { 
    flexDirection: 'row', 
    marginVertical: 8,
    justifyContent: 'flex-start',
  },
  answerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ced4da',
    marginRight: 10,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  selectedAnswer: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  answerText: {
    fontSize: 14,
    color: '#495057',
  },
  selectedAnswerText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  input: {
    borderColor: '#ced4da',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    fontSize: 14,
    minHeight: 40,
  },
  buttonContainer: {
    marginTop: 30,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  pdfButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});