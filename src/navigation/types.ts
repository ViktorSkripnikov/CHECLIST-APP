// Определяем все маршруты приложения и их параметры
export type RootStackParamList = {
    Home: undefined; // Главный экран без параметров
    'Чек-лист': { fileUri: string }; // Экран с параметром fileUri
  };
  
  // Дополнительно можно объявить имена маршрутов как enum для удобства
  export enum Screens {
    HOME = 'Home',
    CHECKLIST = 'Чек-лист',
  }