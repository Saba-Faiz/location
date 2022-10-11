import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions,Button,AsyncStorage } from 'react-native';
import * as Location from 'expo-location';
import { useEffect,useState, useRef } from 'react';
import { doc, setDoc,getFirestore } from "firebase/firestore";
import AppDb from '../firebase/API';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function MainScreen(props) {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  let loc;
  const [location,setLocation]= useState(null);
 const db=getFirestore(AppDb)
  useEffect(()=>{
    (async () => {
      try {
       
        loc= await Location.getCurrentPositionAsync({});
        setLocation(loc);
        if (!Location){
          location.coords.latitude=30.120191181932157
          location.coords.longitude=71.48346587725837
        }
      }
       catch(e){
        console.log(e.message);
       }
     })
  },[]);
  const startWatching = async () => {
    let subscriber;
    try {
      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (location_update) => {
          if (!location_update) {
            location_update = location;
          }
          console.log('update location!', location_update.coords);
          setLocation(location_update);
          createLocation();
        }
      );
    } catch (err) {
      alert(err.message);
    }
    return subscriber;
  };
  //push location in db

  const createLocation = async () => {
    try {
      const docRef = await setDoc(doc(db, 'locations', Date.now() + ''), {
        id: Date.now() + '',
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        createdAt: new Date(),
      });
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  useEffect(() => {
    createLocation();
    if (location){ startWatching()};
  }, []);
  return (
    <View style={styles.container}>
 <Button title='Click here' onPress={()=>props.navigation.navigate('LocationList')}/>
      <MapView style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: 30.120191181932157,
          longitude: 71.48346587725837,
          latitudeDelta: 0.04,
          longitudeDelta: 0.05,
        }}>
        {/* {location}  */}
        <Marker
          coordinate={{
            latitude: 30.120191181932157,
            longitude: 71.48346587725837
          }}
          title={'Marker here'}
          description={'its my city'}
        >
       

        </Marker>
      </MapView>

    </View>
  );
}
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
   
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});