import {Platform} from "react-native";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const setupPushNotificationChannels = async () => {
  if(Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync('application', {
    name: 'Applikation (Allgemeines)',
    description: 'Allgemeine Benachrichtigungen (Versionsupdate, ...)',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [150],
  });

  await Notifications.setNotificationChannelAsync('tasks', {
    name: 'Aufgaben',
    description: 'Benachrichtigungen zu Aufgaben (beteiligt, erwähnt, ...)',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [150],
  });

  await Notifications.setNotificationChannelAsync('comments', {
    name: 'Aufgaben Kommentare',
    description: 'Benachrichtigungen zu Kommentaren (beteiligt, erwähnt, ...)',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [150],
  });

  await Notifications.setNotificationChannelAsync('construction-reports', {
    name: 'Bautagesberichte',
    description: 'Benachrichtigungen zu Bautagesberichten (beteiligt, unterschrieben, ...)',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [150],
  });

  await Notifications.setNotificationChannelAsync('inspection-reports', {
    name: 'Prüfberichte',
    description: 'Benachrichtigungen zu Prüfberichten (unterschrieben, ...)',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [150],
  });

  await Notifications.setNotificationChannelAsync('flow-meter-inspection-reports', {
    name: 'Prüfberichte für Durchflussmesseinrichtungen',
    description: 'Benachrichtigungen zu Prüfberichten für Durchflussmesseinrichtungen (unterschrieben, ...)',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [150],
  });

  await Notifications.setNotificationChannelAsync('additions-reports', {
    name: 'Regieberichte',
    description: 'Benachrichtigungen zu Regieberichten (beteiligt, unterschrieben, ...)',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [150],
  });

  await Notifications.setNotificationChannelAsync('service-reports', {
    name: 'Serviceberichte',
    description: 'Benachrichtigungen zu Serviceberichten (unterschrieben, ...)',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [150],
  });

  await Notifications.setNotificationChannelAsync('holiday', {
    name: 'Urlaub',
    description: 'Benachrichtigungen bei Änderung des verfügbaren Urlaubs',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [150],
  });

}

export const getPushNotificationToken = async () => {
  if(!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const {status} = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);

  return token;

}