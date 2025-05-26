// Типы
export type ChecklistSubitem = {
  id: string;
  question: string;
  answer: string | null;
  comment: string;
};

export type ChecklistItem = {
  id: string;
  question: string;
  subitems: ChecklistSubitem[];
};

export type ChecklistSection = {
  section: string;
  items: ChecklistItem[];
};

// Пример шаблона
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
            question: "- проверка знаний в АО \"Самаранефтегаз\" (удостоверение)",
            answer: null,
            comment: ""
          },
          {
            id: "1.2",
            question: "- аттестация по промышленной безопасности (удостоверение или протокол)",
            answer: null,
            comment: ""
          }
        ]
      }
    ]
  }
];
