import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('checklist.db');

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Таблица шаблонов чек-листов
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS checklist_templates (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
      );

      // Таблица пунктов чек-листов
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS checklist_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          template_id INTEGER,
          title TEXT NOT NULL,
          type TEXT NOT NULL,
          required INTEGER DEFAULT 0,
          options TEXT,
          weight INTEGER DEFAULT 1,
          order_index INTEGER DEFAULT 0,
          FOREIGN KEY (template_id) REFERENCES checklist_templates (id)
        )`
      );

      // Таблица результатов проверок
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS inspections (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          template_id INTEGER,
          object_name TEXT,
          inspector_name TEXT,
          started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME,
          status TEXT DEFAULT 'in_progress',
          total_score INTEGER DEFAULT 0,
          max_score INTEGER DEFAULT 0,
          FOREIGN KEY (template_id) REFERENCES checklist_templates (id)
        )`
      );

      // Таблица ответов на пункты проверки
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS inspection_answers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          inspection_id INTEGER,
          item_id INTEGER,
          answer TEXT,
          comment TEXT,
          photo_path TEXT,
          audio_path TEXT,
          FOREIGN KEY (inspection_id) REFERENCES inspections (id),
          FOREIGN KEY (item_id) REFERENCES checklist_items (id)
        )`
      );
    }, 
    error => reject(error),
    () => resolve()
    );
  });
};

export const getChecklistTemplates = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM checklist_templates ORDER BY created_at DESC',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export const saveChecklistTemplate = (template) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO checklist_templates (name, description) VALUES (?, ?)',
        [template.name, template.description],
        (_, result) => {
          const templateId = result.insertId;
          
          // Сохраняем пункты чек-листа
          template.items.forEach((item, index) => {
            tx.executeSql(
              `INSERT INTO checklist_items 
               (template_id, title, type, required, options, weight, order_index) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                templateId,
                item.title,
                item.type,
                item.required ? 1 : 0,
                JSON.stringify(item.options || []),
                item.weight || 1,
                index
              ]
            );
          });
          
          resolve(templateId);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const getChecklistItems = (templateId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM checklist_items WHERE template_id = ? ORDER BY order_index',
        [templateId],
        (_, { rows }) => {
          const items = rows._array.map(item => ({
            ...item,
            options: JSON.parse(item.options || '[]'),
            required: item.required === 1
          }));
          resolve(items);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const saveInspection = (inspection) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO inspections 
         (template_id, object_name, inspector_name, completed_at, status, total_score, max_score) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          inspection.templateId,
          inspection.objectName,
          inspection.inspectorName,
          new Date().toISOString(),
          'completed',
          inspection.totalScore,
          inspection.maxScore
        ],
        (_, result) => {
          const inspectionId = result.insertId;
          
          // Сохраняем ответы
          inspection.answers.forEach(answer => {
            tx.executeSql(
              `INSERT INTO inspection_answers 
               (inspection_id, item_id, answer, comment) 
               VALUES (?, ?, ?, ?)`,
              [inspectionId, answer.itemId, answer.answer, answer.comment || '']
            );
          });
          
          resolve(inspectionId);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const getInspections = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT i.*, t.name as template_name 
         FROM inspections i 
         LEFT JOIN checklist_templates t ON i.template_id = t.id 
         ORDER BY i.started_at DESC`,
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};