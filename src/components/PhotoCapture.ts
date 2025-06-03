//Переиспользуемые компоненты
import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

/**
 * Компонент для добавления фотографий к элементу чек-листа
 */
const PhotoCapture = ({ photos = [], onPhotosChange }) => {
  // Запрос разрешений на доступ к камере и галерее
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Недостаточно прав',
        'Для работы с фотографиями необходимо разрешение на доступ к камере и галерее',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    return true;
  };

  // Захват фото с камеры
  const takePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhoto = result.assets[0];
        onPhotosChange([...photos, newPhoto.uri]);
      }
    } catch (error) {
      console.error('Ошибка при захвате фото:', error);
      Alert.alert('Ошибка', 'Не удалось сделать фото');
    }
  };

  // Выбор фото из галереи
  const pickImage = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhoto = result.assets[0];
        onPhotosChange([...photos, newPhoto.uri]);
      }
    } catch (error) {
      console.error('Ошибка при выборе фото:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать фото');
    }
  };

  // Удаление фото
  const removePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    onPhotosChange(updatedPhotos);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          icon="camera" 
          onPress={takePhoto}
          style={styles.button}
        >
          Камера
        </Button>
        <Button 
          mode="contained" 
          icon="image" 
          onPress={pickImage} 
          style={styles.button}
        >
          Галерея
        </Button>
      </View>
      
      {photos.length > 0 && (
        <ScrollView horizontal style={styles.photosContainer}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoWrapper}>
              <Image source={{ uri: photo }} style={styles.photo} />
              <Button 
                icon="close-circle" 
                size={20} 
                onPress={() => removePhoto(index)}
                style={styles.removeButton}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10