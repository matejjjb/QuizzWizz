import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView} from 'react-native';
import { useNavigation } from 'expo-router';
import TriviaScreen from './TriviaScreen';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [triviaFact, setTriviaFact] = useState('');

  const handleNextFact = (data) => {
    setTriviaFact(data);
  };

  return (
    <LinearGradient
      colors={['#7F0000', '#FF4500', '#FF8C00', '#FFA500', '#FFD700']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.headingText}>Welcome to QuizWizz</Text>
            <View style={styles.quoteContainer}>
              <TriviaScreen onNextFact={handleNextFact} />
            </View>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={() => navigation.navigate("Quiz")}>
                <Text style={styles.buttonText}>Start quiz</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => navigation.navigate("HighScore")}>
                <Text style={styles.buttonText}>High Score</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => navigation.navigate("Training")}>
                <Text style={styles.buttonText}>Training</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => navigation.navigate("Exit")}>
                <Text style={styles.buttonText}>Exit</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    marginTop: 25,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  headingText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 30,
    fontWeight: '400',
    marginBottom: 10,
    padding: 35,
  },
  quoteContainer: {
    backgroundColor: '#FE945B',
    borderRadius: 6,
    marginBottom: 30,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 100,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  button: {
    backgroundColor: '#FFFFE0',
    padding: 10,
    borderRadius: 30,
    marginVertical: 20,
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#00CCCC',
    fontWeight: '600',
    textAlign: 'center',
  },
  gradient: {
    flex: 1,
  },
});

export default HomeScreen;