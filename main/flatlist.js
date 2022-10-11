import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, Text } from 'react-native';
import { collection, query, onSnapshot, getFirestore } from 'firebase/firestore';
import AppDb from '../firebase/API'

const LocationList = () => {
  const [LocData, setData] = useState(null);
  const db = getFirestore(AppDb)

  useEffect(() => {
    const fb = query(collection(db, 'locations'));
    const unsubscribe = onSnapshot(fb, (querySnapshot) => {
      const locations = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(locations);
      setData(locations);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={LocData}
        style={styles.flatListStyle}
        renderItem={({ item }) => {
          return (
            <View style={styles.fatifit}>
              <Image
                style={{ height: 70, width: 70 }}
                source={require('../assets/marker.png')}

              />
              <Text style={styles.text}>{`Latitude: ${item.latitude}`}</Text>
              <Text style={styles.text}>{`Longitude: ${item.longitude}`}</Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    color: '#fff',
  },
  list: {
    color: '#fff',
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    padding: 10,
  },
  flatListStyle: {
    flex: 1,
    width: '96%',
    flexDirection: 'row',
    
    // alignItems: 'center',
    margin: 5,

  },
  fatifit: {
    flex: 1,
    width: '96%',
   
   
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#fea440',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#252d4a',
    borderRadius: 10,
  }
});
export default LocationList