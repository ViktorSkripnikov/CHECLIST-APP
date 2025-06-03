// ## 7. components/ChecklistItem.tsx - Компонент элемента
// ```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { ChecklistHandlers } from '../types';
import { ChecklistSubitem } from './ChecklistSubitem';
import { styles } from '../styles';

interface Props {
  item: any; // Здесь лучше создать правильный тип
  sectionIdx: number;
  itemIdx: number;
  handlers: ChecklistHandlers;
}

export const ChecklistItem: React.FC<Props> = ({ item, sectionIdx, itemIdx, handlers }) => {
  return (
    <View>
      <Text style={styles.itemTitle}>{item.id}. {item.question}</Text>
      
      {item.subitems.map((sub: any, subIdx: number) => (
        <ChecklistSubitem
          key={sub.id}
          subitem={sub}
          sectionIdx={sectionIdx}
          itemIdx={itemIdx}
          subIdx={subIdx}
          handlers={handlers}
        />
      ))}
    </View>
  );
};