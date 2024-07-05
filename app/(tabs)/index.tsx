import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions'; // For older versions, if needed

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [timings, setTimings] = useState(null);

  useEffect(() => {
    function getFormattedDate() {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const year = today.getFullYear();
      return `${day}-${month}-${year}`;
    }

    const url = `https://api.aladhan.com/v1/timingsByCity/${getFormattedDate()}?city=blida&country=algeria`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTimings(data.data.timings);
        scheduleNotifications(data.data.timings); // Schedule notifications after timings are fetched
      })
      .catch((error) => {
        console.error('Error fetching the data:', error);
      });
  }, []);

  // Function to schedule notifications
  const scheduleNotifications = async (timings) => {
    if (!timings) return;

    // Request permissions if not granted
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }

    // Schedule notifications
    Notifications.cancelAllScheduledNotificationsAsync();
    Object.entries(timings).forEach(([key, value]) => {
      const prayerTime = new Date(`${getFormattedDate()} ${value}`);
      const notificationTime = new Date(prayerTime.getTime() - 5 * 60 * 1000); // 5 minutes before

      Notifications.scheduleNotificationAsync({
        content: {
          title: `${key} time is coming`,
          body: `Prayer time at ${value}`,
          data: { prayer: key, time: value },
        },
        trigger: { seconds: (notificationTime.getTime() - Date.now()) / 1000 },
      });
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes. Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>

      {timings && (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Prayer Timings</ThemedText>
          {Object.entries(timings).map(([key, value]) => (
            <Text style={styles.stepContainer} key={key}>
              {key}: {value}
            </Text>
          ))}
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    color: 'white',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

