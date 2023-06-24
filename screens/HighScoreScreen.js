import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Alert, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const HighScoreScreen = () => {
  const [scores, setScores] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getHighScores = async () => {
      try {
        const storedScores = await AsyncStorage.getItem('@scores');
        const parsedScores = storedScores ? JSON.parse(storedScores) : [];

        const sortedScores = parsedScores.sort((a, b) => b.score - a.score);

        setScores(sortedScores);
      } catch (e) {
        // Error reading the high scores
        console.error('Error reading high scores:', e);
      }
    };

    getHighScores();
  }, []);

  const handleResetScores = async () => {
    try {
      await AsyncStorage.removeItem('@scores');
      setScores([]);
      Alert.alert('Scores Reset', 'All stored usernames and points have been deleted.');
    } catch (e) {
      // Error resetting the scores
      console.error('Error resetting scores:', e);
    }
  };

  const goToHomeScreen = () => {
    navigation.navigate('Home');
  };

  return (
    <LinearGradient
    colors={['#7F0000', '#FF4500', '#FF8C00', '#FFA500', '#FFD700']}
    style={styles.gradient}
  >
    <SafeAreaView style={styles.container}>
     
     <View style={styles.homeButton}>
    <TouchableOpacity
        
        onPress={goToHomeScreen}
      >
         <Icon name="home" size={36} color="black" />
      </TouchableOpacity>
      </View>
       
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetScores}
      >
        <Text style={styles.resetButtonText}>RESET SCOREES</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Text style={styles.title}>High Scores</Text>
        {scores.map((score, index) => (
          <View key={index} style={styles.scoreContainer}>
            <Text style={styles.username}>{score.name}</Text>
            <Text style={styles.points}>{score.score} points</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  scoreContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  
  },
  username: {
    flex: 1,
    fontSize: 16,
    textAlign: 'left',
    paddingVertical: 5,
  },
  points: {
    fontSize: 16,
    marginLeft: 10,
    backgroundColor: '#CC5500',
    borderWidth: 2,
    paddingVertical: 5,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    justifyContent: 'center',
    

  },
  resetButton: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'red',
    borderRadius: 8,
    position : 'relative',
    bottom: 10
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homeButton: {
    position: 'absolute',
    top: 30 ,
    right: 200,
    padding: 30,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
  }
});

export default HighScoreScreen;
