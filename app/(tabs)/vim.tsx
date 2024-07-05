import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


export default function App() {

const requestNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Notifications permissions not granted!');
  }
};

  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    requestNotificationPermissions(); // Optional: Request permissions
  }, []);

  const handleNotificationSchedule = async () => {
    await scheduleNotification();
    setIsScheduled(true);
  };

const scheduleNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "LARBI ISHAK notification",
      body: 'Here is the notification body',
      data: { data: 'goes here', test: { test1: 'more data' } },
    },
    trigger: null
  });
  setIsScheduled(false)
};

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>

 <Button
        title={isScheduled ? 'Notification Scheduled' : 'Schedule Notification'}
        onPress={handleNotificationSchedule}
        disabled={isScheduled}
      />

    </View>
  );
}


// OPTIONAL
// const getExpoPushToken = async () => {
//   const { data } = await Notifications.getExpoPushTokenAsync();
//   console.log("this is my push token", data.token); // This is your push token
// };

