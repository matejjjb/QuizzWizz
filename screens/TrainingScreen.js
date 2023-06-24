import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const TrainingScreen = ({ navigation }) => {
  const [selectedQuestions, setSelectedQuestions] = useState(20);
  const [startTraining, setStartTraining] = useState(false);

  const handleQuestionSelection = (numQuestions) => {
    setSelectedQuestions(numQuestions);
  };

  const handleConfirmSelection = () => {
    setStartTraining(true);
  };

  const startTrainingQuiz = () => {
    navigation.navigate('Quiz', { numQuestions: selectedQuestions });
  };

  return (
    <LinearGradient
        colors={['#7F0000', '#FF4500', '#FF8C00', '#FFA500', '#FFD700']}
        style={styles.gradient}
      >
    <SafeAreaView style={styles.container}>
    <View style={styles.header}>
          <Pressable
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Icon name="home" size={36} color="black" />
          </Pressable>
        </View>
      <Text style={styles.title}>Training</Text>
      <Text style={styles.subtitle}>Select the number of questions:</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.button,
            selectedQuestions === 20 && styles.selectedButton,
          ]}
          onPress={() => handleQuestionSelection(20)}
        >
          <Text style={styles.buttonText}>20</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            selectedQuestions === 30 && styles.selectedButton,
          ]}
          onPress={() => handleQuestionSelection(30)}
        >
          <Text style={styles.buttonText}>30</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            selectedQuestions === 40 && styles.selectedButton,
          ]}
          onPress={() => handleQuestionSelection(40)}
        >
          <Text style={styles.buttonText}>40</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            selectedQuestions === 50 && styles.selectedButton,
          ]}
          onPress={() => handleQuestionSelection(50)}
        >
          <Text style={styles.buttonText}>50</Text>
        </Pressable>
      </View>
      {!startTraining && (
        <Pressable style={styles.confirmButton} onPress={handleConfirmSelection}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </Pressable>
      )}
      {startTraining && (
        <Pressable style={styles.startButton} onPress={startTrainingQuiz}>
          <Text style={styles.startButtonText}>Start Training</Text>
        </Pressable>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: 'lightgray',
  },
  selectedButton: {
    backgroundColor: '#F02626',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#00008B',
    marginBottom: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: 'blue',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gradient: {
    flex: 1,
  },
  homeButton: {
    position: 'absolute',
    bottom: 150,
    right: 90,
    padding: 30,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  
});

export default TrainingScreen;
