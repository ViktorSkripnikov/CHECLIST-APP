//Переиспользуемые компоненты
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, IconButton } from 'react-native-paper';

/**
 * Компонент элемента чек-листа для отображения в списке
 */
const ChecklistItem = ({ checklist, onPress, onDelete }) => {
  // Получаем дату создания в удобном формате
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card style={styles.card} onPress={() => onPress(checklist)}>
      <Card.Content>
        <View style={styles.container}>
          <View style={styles.info}>
            <Text style={styles.title}>{checklist.title}</Text>
            <Text style={styles.date}>
              Создан: {formatDate(checklist.created)}
            </Text>
            <Text style={styles.stats}>
              Вопросов: {checklist.data.questions.length}
            </Text>
          </View>
          
          <IconButton
            icon="delete"
            size={24}
            onPress={() => onDelete(checklist.id)}
            style={styles.deleteButton}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    elevation: 2,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  stats: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    margin: 0,
  },
});

export default ChecklistItem;