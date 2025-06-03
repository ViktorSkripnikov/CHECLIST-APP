# 📋 Checklist App (React Native + Expo)

Мобильное приложение для проведения проверок по чек-листам:
- загружает чек-листы из Excel или использует встроенные шаблоны;
- позволяет выбирать ответы (Да / Нет / Н/П) и оставлять комментарии;
- сохраняет заполненные чек-листы в `.json`-файл.

---

## 🚀 Функции

- 📄 Использовать готовый шаблон (встроенный `parsedChecklist.ts`);
- 📂 Загрузка Excel-файла через `expo-document-picker`;
- ✅ Отображение в формате: разделы → пункты → подпункты;
- 📝 Ввод ответа и комментария;
- 💾 Сохранение в `.json`-файл через `expo-file-system`.

---

## 🧱 Стек технологий

- React Native + Expo
- TypeScript
- XLSX.js (парсинг Excel-файлов)
- expo-document-picker
- expo-file-system

---




## 📂 Структура проекта
checklist-app/
├── App.tsx
├── screens/
│ ├── HomeScreen.tsx # Выбор шаблона или Excel
│ └── ChecklistScreen.tsx # Отображение и заполнение чек-листа
├── utils/
│ ├── parseExcel.ts # Преобразование Excel → checklistData[]
│ └── parsedChecklist.ts # Встроенный шаблон чек-листа
├── assets/
├── package.json
└── README.md


---

## 🧪 Запуск проекта

```bash
npx create-expo-app checklist-app
cd checklist-app

npx expo install expo-document-picker expo-file-system
npm install xlsx
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context

npx expo start --android
npx expo start 

🔒 Лицензия
Лицензия для личного и коммерческого использования — обсуждается.

---

## 🧭 Дальше:

1. Добавь файл `README.md` в git:


git add README.md
git commit -m "📝 Добавлен README с описанием проекта"