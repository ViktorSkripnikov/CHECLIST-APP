import React from 'react';
import { View, ScrollView } from 'react-native';
import { ChecklistScreenProps } from './types';
import { useChecklistData } from './hooks/useChecklistData';
import { useChecklistActions } from './hooks/useChecklistActions';
import { ChecklistSection } from './components/ChecklistSection';
import { ActionButtons } from './components/ActionButtons';
import { styles } from './styles';

export default function ChecklistScreen({ route }: ChecklistScreenProps) {
  // Хуки для управления данными и действиями
  const { data, handleAnswer, handleComment } = useChecklistData(route.params.checklist);
  const { 
    isGeneratingPdf, 
    handleSave, 
    handleExportToFile, 
    handleShareFile, 
    generatePdf 
  } = useChecklistActions(data);

  // Обработчики для передачи в компоненты
  const handlers = { handleAnswer, handleComment };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Рендер секций чек-листа */}
        {data.map((section, sectionIdx) => (
          <ChecklistSection
            key={sectionIdx}
            section={section}
            sectionIdx={sectionIdx}
            handlers={handlers}
          />
        ))}
        
        {/* Кнопки действий */}
        <ActionButtons
          isGeneratingPdf={isGeneratingPdf}
          onSave={handleSave}
          onGeneratePdf={generatePdf}
          onShare={handleShareFile}
          onExport={handleExportToFile}
        />
      </ScrollView>
    </View>
  );
}