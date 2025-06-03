// ## 6. components/ChecklistSection.tsx - Компонент секции
// ```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { ChecklistSection as ChecklistSectionType } from '../../../utils/parsedChecklist';
import { ChecklistHandlers } from '../types';
import { ChecklistItem } from './ChecklistItem';
import { styles } from '../styles';

interface Props {
  section: ChecklistSectionType;
  sectionIdx: number;
  handlers: ChecklistHandlers;
}

export const ChecklistSection: React.FC<Props> = ({ section, sectionIdx, handlers }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.section}</Text>
      
      {section.items.map((item, itemIdx) => (
        <ChecklistItem
          key={item.id}
          item={item}
          sectionIdx={sectionIdx}
          itemIdx={itemIdx}
          handlers={handlers}
        />
      ))}
    </View>
  );
};