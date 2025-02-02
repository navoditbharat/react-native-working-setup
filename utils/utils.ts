import {Platform, Alert} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const requestCameraPermission = async () => {
  try {
    const alreadyAsked = await AsyncStorage.getItem(
      'camera_permission_requested',
    );

    if (alreadyAsked === 'true') {
      console.log('Camera permission already requested');
      return;
    }

    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;

    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      console.log('✅ Camera permission granted');
    } else if (result === RESULTS.DENIED) {
      console.log('❌ Camera permission denied');
      Alert.alert(
        'Permission Required',
        'Please allow camera access from settings.',
      );
    } else if (result === RESULTS.BLOCKED) {
      console.log('🚫 Camera permission permanently denied');
      Alert.alert(
        'Permission Blocked',
        'Camera permission is blocked. Please enable it in app settings.',
        [{text: 'Open Settings', onPress: () => openSettings()}],
      );
    }

    await AsyncStorage.setItem('camera_permission_requested', 'true');
  } catch (error) {
    console.error('Error requesting camera permission:', error);
  }
};
