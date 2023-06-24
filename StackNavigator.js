import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ExitScreen from './screens/ExitScreen';
import HighScoreScreen from './screens/HighScoreScreen';
import TrainingScreen from './screens/TrainingScreen';



const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    
      <Stack.Navigator
        screenOptions={{
          headerShown: false 
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="HighScore" component={HighScoreScreen} />
        <Stack.Screen name ="Training" component={TrainingScreen} />
        <Stack.Screen name="Exit" component={ExitScreen} />
        

      </Stack.Navigator>
    
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
