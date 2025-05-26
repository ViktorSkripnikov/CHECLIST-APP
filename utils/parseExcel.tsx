// utils/parseExcel.ts
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { ChecklistSection } from './parsedChecklist';

export const parseExcelToChecklist = async (fileUri: string): Promise<ChecklistSection[]> => {
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const workbook = XLSX.read(base64, { type: 'base64' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  const checklist: ChecklistSection[] = [];
  let currentSection: ChecklistSection | null = null;
  let currentItem: any = null;

  for (const row of rows) {
    const code = row[0];
    const text = row[1];

    if (!code && text) {
      currentSection = { section: text, items: [] };
      checklist.push(currentSection);
    } else if (typeof code === 'number' && text && currentSection) {
      currentItem = { id: String(code), question: text, subitems: [] };
      currentSection.items.push(currentItem);
    } else if (typeof code === 'string' && code.includes('.') && text && currentItem) {
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

export const checklistData: ChecklistSection[] = [
  {
    section: "Обучение персонала, СИЗ, СИЗОД, общие требования",
    items: [
      {
        id: "1",
        question: "Обучение ИТР:",
        subitems: [
          {
            id: "1.1",
            question: "Проверка знаний в АО 'Самаранефтегаз'",
            answer: null,
            comment: ""
          }
        ]
      }
    ]
  }
  // ← сюда вставь остальную структуру, которую я тебе выдавал ранее
];
