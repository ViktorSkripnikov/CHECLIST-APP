//## 3. utils.ts - Утилиты и хелперы
//```typescript
import * as FileSystem from 'expo-file-system';
import { ChecklistSection } from '../../utils/parsedChecklist';
import { ANSWER_COLORS, FILE_CONFIG } from './constants';

// Генерация уникального имени файла
export const generateFileName = (prefix: string, extension: string): string => {
  const timestamp = Date.now();
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}_${date}_${timestamp}.${extension}`;
};

// Создание пути к файлу
export const createFilePath = (filename: string): string => {
  return `${FileSystem.documentDirectory}${filename}`;
};

// Форматирование даты для отчета
export const formatReportDate = (): string => {
  return new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Получение CSS класса для ответа
export const getAnswerClass = (answer: string): string => {
  switch (answer) {
    case 'Да': return 'answer-yes';
    case 'Нет': return 'answer-no';
    case 'Н/П': return 'answer-na';
    default: return '';
  }
};

// Генерация HTML контента для PDF
export const generateHtmlContent = (data: ChecklistSection[]): string => {
  return `
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
          .answer-yes { background-color: ${ANSWER_COLORS['Да']}; }
          .answer-no { background-color: ${ANSWER_COLORS['Нет']}; }
          .answer-na { background-color: ${ANSWER_COLORS['Н/П']}; }
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
        ${generateSectionsHtml(data)}
        <div class="footer">
          Дата создания отчета: ${formatReportDate()}
        </div>
      </body>
    </html>
  `;
};

// Генерация HTML для секций
const generateSectionsHtml = (data: ChecklistSection[]): string => {
  return data.map(section => `
    <h2>${section.section}</h2>
    ${generateItemsHtml(section.items)}
  `).join('');
};

// Генерация HTML для элементов
const generateItemsHtml = (items: any[]): string => {
  return items.map(item => `
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
        ${generateSubitemsHtml(item.subitems)}
      </tbody>
    </table>
  `).join('');
};

// Генерация HTML для подэлементов
const generateSubitemsHtml = (subitems: any[]): string => {
  return subitems.map(sub => `
    <tr>
      <td>${sub.id}</td>
      <td>${sub.question}</td>
      <td class="${getAnswerClass(sub.answer)}">${sub.answer || '-'}</td>
      <td>${sub.comment || '-'}</td>
    </tr>
  `).join('');
};