import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { ChecklistSection } from './parsedChecklist';

/**
 * Парсит Excel-файл в структуру ChecklistSection[]:
 * - Строка без кода и с текстом → это заголовок раздела
 * - Число без точки (например 1) → это пункт
 * - Строка с точкой (например 1.1) → это подпункт
 */
export const parseExcelToChecklist = async (fileUri: string): Promise<ChecklistSection[]> => {
  // Читаем файл как base64
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Читаем Excel в формате base64
  const workbook = XLSX.read(base64, { type: 'base64' });

  // Получаем первую страницу
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Получаем строки как массив массивов
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  // Результат
  const checklist: ChecklistSection[] = [];

  let currentSection: ChecklistSection | null = null;
  let currentItem: { id: string; question: string; subitems: any[] } | null = null;

  for (const row of rows) {
    const code = row[0];
    const text = row[1];

    if (!code && text) {
      // Раздел
      currentSection = { section: text, items: [] };
      checklist.push(currentSection);
    } else if (typeof code === 'number' && text && currentSection) {
      // Пункт
      currentItem = { id: String(code), question: text, subitems: [] };
      currentSection.items.push(currentItem);
    } else if (typeof code === 'string' && code.includes('.') && text && currentItem) {
      // Подпункт
      currentItem.subitems.push({
        id: code,
        question: text,
        answer: null,
        comment: ''
      });
    }
  }

  return checklist;
};
