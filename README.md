# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Создание проекта
npx create-expo-app EmotionalCompass --template blank-typescript

# Переход в папку
cd EmotionalCompass

# Установка зависимостей

npm install zustand 

npx expo install firebase

npx expo install @react-native-async-storage/async-storage

npx expo install expo-secure-store expo-image-picker expo-image

npx expo install expo-notifications expo-notifications

npx expo install react-native-svg react-native-svg-charts

npx expo install expo-linear-gradient

npm install react-native-gesture-handler react-native-reanimated

npm install expo-linking --legacy-peer-deps

npm install @react-navigation/elements @react-navigation/bottom-tabs expo-haptics --legacy-peer-deps

npm install expo-symbols --legacy-peer-deps


{

  "name": "emotional-compass",
  
  "version": "1.0.0",
  
  "main": "expo-router/entry",

  "scripts": {
  
    "start": "expo start",
    
    "android": "expo start --android",
    
    "ios": "expo start --ios",
    
    "web": "expo start --web"
    
  },
  
  "dependencies": {
  
    "@react-native-async-storage/async-storage": "2.2.0",
    
    "@react-navigation/bottom-tabs": "^7.15.10",
    
    "@react-navigation/elements": "^2.9.15",
    
    "expo": "~54.0.0",
    
    "expo-haptics": "~15.0.7",
    
    "expo-image": "~3.0.11",
    
    "expo-image-picker": "~17.0.11",
    
    "expo-linear-gradient": "~15.0.8",
    
    "expo-linking": "~8.0.12",
    
    "expo-notifications": "~0.29.0",
    
    "expo-router": "~6.0.0",
    
    "expo-secure-store": "~15.0.8",
    
    "expo-status-bar": "~2.0.0",
    
    "expo-symbols": "~1.0.7",
    
    "expo-web-browser": "~15.0.9",
    
    "firebase": "^11.10.0",
    
    "react": "19.1.0",
    
    "react-native": "0.81.5",
    
    "react-native-gesture-handler": "~2.20.0",
    
    "react-native-reanimated": "~3.16.0",
    
    "react-native-safe-area-context": "4.12.0",
    
    "react-native-screens": "~4.4.0",
    
    "react-native-svg": "15.12.1",
    
    "zustand": "^5.0.3"
    
  },
  
  "devDependencies": {
  
    "@babel/core": "^7.25.2",
    
    "@types/react": "~19.1.10",
    
    "typescript": "^5.3.3"
    
  }
  
}

# Запуск
npm install react-native-reanimated@~4.1.1 react-native-worklets@0.5.1 --legacy-peer-deps
npx expo start -c

