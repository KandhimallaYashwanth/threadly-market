
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For demo purposes - in a production app, these should be in environment variables
const firebaseConfig = {
  apiKey: "AIzaSyD_example_key_for_demo",
  authDomain: "handloom-marketplace.firebaseapp.com",
  projectId: "handloom-marketplace",
  storageBucket: "handloom-marketplace.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuv"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

// For development/demo purposes, we can use localStorage to mock Firebase storage
export const mockStorage = {
  uploadFile: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve(dataUrl);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  }
};
