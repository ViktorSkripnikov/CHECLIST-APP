//утилиту для работы с локальным хранилищем:
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

// Ключи для AsyncStorage
const CHECKLISTS_KEY = '@checklists';
const COMPLETED_CHECKLISTS_KEY = '@completed_checklists';

// Инициализация базы данных SQLite
const db = SQLite.openDatabase('checklists.db');

// Инициализация таблиц в базе данных
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Таблица для шаблонов чек-листов
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS checklists (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          created TEXT NOT NULL,
          data TEXT NOT NULL
        );`,
        [],
        () => {
          // Таблица для заполненных чек-листов
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS completed_checklists (
              id TEXT PRIMARY KEY,
              template_id TEXT NOT NULL,
              title TEXT NOT NULL,
              completed_date TEXT NOT NULL,
              data TEXT NOT NULL,
              synced INTEGER DEFAULT 0
            );`,
            [],
            () => { resolve(); },
            (_, error) => { reject(error); }
          );
        },
        (_, error) => { reject(error); }
      );
    });
  });
};

/**
 * Сохраняет шаблон чек-листа в хранилище
 * @param {Object} checklist - Чек-лист для сохранения
 */
export const saveChecklist = async (checklist) => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO checklists (id, title, created, data) VALUES (?, ?, ?, ?);',
          [checklist.id, checklist.title, checklist.created, JSON.stringify(checklist)],
          (_, result) => { resolve(result); },
          (_, error) => { reject(error); }
        );
      });
    });
  } catch (error) {
    console.error('Ошибка при сохранении чек-листа:', error);
    throw error;
  }
};

/**
 * Получает список всех шаблонов чек-листов
 * @returns {Promise<Array>} - Массив чек-листов
 */
export const getChecklists = async () => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM checklists ORDER BY created DESC;',
          [],
          (_, { rows }) => {
            const checklists = rows._array.map(item => ({
              ...item,
              data: JSON.parse(item.data)
            }));
            resolve(checklists);
          },
          (_, error) => { reject(error); }
        );
      });
    });
  } catch (error) {
    console.error('Ошибка при получении чек-листов:', error);
    // Если база данных еще не инициализирована, вернуть пустой массив
    return [];
  }
};

/**
 * Получает конкретный шаблон чек-листа по ID
 * @param {string} id - ID чек-листа
 * @returns {Promise<Object>} - Чек-лист
 */
export const getChecklistById = async (id) => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM checklists WHERE id = ?;',
          [id],
          (_, { rows }) => {
            if (rows.length > 0) {
              const checklist = {
                ...rows.item(0),
                data: JSON.parse(rows.item(0).data)
              };
              resolve(checklist);
            } else {
              resolve(null);
            }
          },
          (_, error) => { reject(error); }
        );
      });
    });
  } catch (error) {
    console.error('Ошибка при получении чек-листа:', error);
    return null;
  }
};

/**
 * Удаляет шаблон чек-листа
 * @param {string} id - ID чек-листа для удаления
 */
export const deleteChecklist = async (id) => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM checklists WHERE id = ?;',
          [id],
          (_, result) => { resolve(result); },
          (_, error) => { reject(error); }
        );
      });
    });
  } catch (error) {
    console.error('Ошибка при удалении чек-листа:', error);
    throw error;
  }
};

/**
 * Сохраняет заполненный чек-лист
 * @param {Object} completedChecklist - Заполненный чек-лист
 */
export const saveCompletedChecklist = async (completedChecklist) => {
  try {
    const id = completedChecklist.id || Date.now().toString();
    const completedDate = new Date().toISOString();
    
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT OR REPLACE INTO completed_checklists 
           (id, template_id, title, completed_date, data, synced) 
           VALUES (?, ?, ?, ?, ?, ?);`,
          [
            id, 
            completedChecklist.templateId, 
            completedChecklist.title, 
            completedDate, 
            JSON.stringify(completedChecklist),
            0 // не синхронизирован по умолчанию
          ],
          (_, result) => { resolve({ ...completedChecklist, id, completedDate }); },
          (_, error) => { reject(error); }
        );
      });
    });
  } catch (error) {
    console.error('Ошибка при сохранении заполненного чек-листа:', error);
    throw error;
  }
};

/**
 * Получает список всех заполненных чек-листов
 * @returns {Promise<Array>} - Массив заполненных чек-листов
 */
export const getCompletedChecklists = async () => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM completed_checklists ORDER BY completed_date DESC;',
          [],
          (_, { rows }) => {
            const completedChecklists = rows._array.map(item => ({
              ...item,
              data: JSON.parse(item.data)
            }));
            resolve(completedChecklists);
          },
          (_, error) => { reject(error); }
        );
      });
    });
  } catch (error) {
    console.error('Ошибка при получении заполненных чек-листов:', error);
    return [];
  }
};

/**
 * Получает заполненный чек-лист по ID
 * @param {string} id - ID заполненного чек-листа
 * @returns {Promise<Object>} - Заполненный чек-лист
 */
export const getCompletedChecklistById = async (id) => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM completed_checklists WHERE id = ?;',
          [id],
          (_, { rows }) => {
            if (rows.length > 0) {
              const completedChecklist = {
                ...rows.item(0),
                data: JSON.parse(rows.item(0).data)
              };
              resolve(completedChecklist);
            } else {
              resolve(null);
            }
          },
          (_, error) => { reject(error); }
        );
      });
    });
  } catch (error) {
    console.error('Ошибка при получении заполненного чек-листа:', error);
    return null;
  }
};