// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';


const API_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s';

const App = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Check AsyncStorage for cached images
        const cachedImages = await AsyncStorage.getItem('cachedImages');
        if (cachedImages) {
          setImages(JSON.parse(cachedImages));
        } else {
          const response = await fetch(API_URL);
          const data = await response.json();
          setImages(data.photos.photo);
          // Cache the images in AsyncStorage
          AsyncStorage.setItem('cachedImages', JSON.stringify(data.photos.photo));
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleImagePress = (url) => {
    setSelectedImage(url)

  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <ScrollView>
      <View>
        {/* Left navbar */}
        <Text style={styles.navbar}>Home</Text>
      </View>
      <ScrollView>
        <View style={styles.imageContainer}>
          {/* Display recent images */}
          {images.map((image) => (
            <TouchableOpacity key={image.id} onPress={() => handleImagePress(image.url_s)}>
              <Image source={{ uri: image.url_s }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Image open in full size  */}
      <Modal visible={!!selectedImage} transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </ScrollView>
  );
};

export default App;
