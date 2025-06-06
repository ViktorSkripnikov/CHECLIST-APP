import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    padding: 20,
    paddingBottom: 40,
  },
  
  // Стиль для секции чек-листа
  section: { 
    marginBottom: 25,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },

  // Заголовок секции
  sectionTitle: { 
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },

  // Заголовок вопроса
  itemTitle: { 
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: '#34495e',
  },

  // Контейнер для подвопроса
  subitem: { 
    marginVertical: 12,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  // Текст подвопроса
  questionText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#495057',
  },

  // Контейнер для кнопок ответов
  answerRow: { 
    flexDirection: 'row',
    marginVertical: 8,
    justifyContent: 'flex-start',
  },

  // Базовая стиль кнопки ответа
  answerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ced4da',
    marginRight: 10,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },

  // Стиль для выбранного ответа
  selectedAnswer: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },

  // Текст кнопки ответа
  answerText: {
    fontSize: 14,
    color: '#495057',
  },

  // Текст выбранного ответа
  selectedAnswerText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  // Поле для ввода комментария
  input: {
    borderColor: '#ced4da',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    fontSize: 14,
    minHeight: 40,
  },

  // Контейнер для кнопок действий
  buttonContainer: {
    marginTop: 30,
    gap: 12,
  },

  // Общие стили для кнопок
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

  // Стиль для неактивной кнопки
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },

  // Текст внутри кнопок
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});