import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, TextInput } from 'react-native';
import { decode } from 'he';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons';
import correctSound from '../assets/correctSound.wav';
import incorrectSound from '../assets/incorrectSound.wav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const QuizScreen = ({ navigation, route }) => {     
  const { numQuestions = 10 } = route.params || {}; 

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [points, setPoints] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [selectedOptionIsCorrect, setSelectedOptionIsCorrect] = useState(false);
  const [timer, setTimer] = useState(30);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [highScores, setHighScores] = useState([]);
  const [username, setUsername] = useState('');
  const [showUsernameInput, setShowUsernameInput] = useState(true);
  const [correctAudio, setCorrectAudio] = useState(new Audio.Sound());
  const [incorrectAudio, setIncorrectAudio] = useState(new Audio.Sound());
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  useEffect(() => {
    if (numQuestions) { 
      fetchTriviaQuestions(numQuestions)
        .then((data) => {
          const shuffledQuestions = shuffleQuestions(data);
          setQuestions(shuffledQuestions);
        })
        .catch((error) => console.error(error));
    }
  }, [numQuestions]);


  const fetchTriviaQuestions = async (amount) => {
  
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=${amount}`);
      const data = await response.json(); 
      return data.results;
    } catch (error) {
      console.error('Error fetching trivia questions:', error);
      return [];
    }
  };

  const shuffleQuestions = (questions) => {
    return questions.map((question) => {
      const answerOptions = shuffleOptions([
        ...question.incorrect_answers,
        question.correct_answer,
      ]);
      return { ...question, answerOptions };
    });
  };

  const shuffleOptions = (options) => {
    let shuffledOptions = [...options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [
        shuffledOptions[j],
        shuffledOptions[i],
      ];
    }
    return shuffledOptions;
  };

  const saveHighScore = (score) => {
    setHighScores((prevHighScores) => [...prevHighScores, score]);
  };

  useEffect(() => {
    if (questions.length === 0) {
      return;
    }

    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          handleAnswerOption('');
          return 30;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [questions, currentQuestionIndex, timer,showUsernameInput]);

  const handleAnswerOption = async (option) => {
    setSelectedOption(option);
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
      return;
    }

    const isCorrect = option === currentQuestion.correct_answer;

    if (timer === 0) {
      setMistakes((prevMistakes) => [...prevMistakes, currentQuestion]);
      setSelectedOptionIsCorrect(false);
      setAnswerStatus('incorrect');
      await playIncorrectSound();
    } else if (isCorrect) {
      let answerTime = 30 - timer;
      let answerPoints;
      if (answerTime >= 20) {
        answerPoints = 100;
      } else if (answerTime >= 10) {
        answerPoints = 500;
      } else {
        answerPoints = 1000;
      }
      setPoints((prevPoints) => prevPoints + answerPoints);
      setSelectedOptionIsCorrect(true);
      setAnswerStatus('correct');
      await playCorrectSound();
    } else {
      setMistakes((prevMistakes) => [...prevMistakes, currentQuestion]);
      setSelectedOptionIsCorrect(false);
      setAnswerStatus('incorrect');
      await playIncorrectSound();
    }

    await new Promise((resolve) => setTimeout(resolve, 750));

    setCurrentQuestionIndex((prevIndex) => (prevIndex === undefined ? 1 : prevIndex + 1));
    setTimer(30);
    setSelectedOption('');
    setAnswerStatus(null);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) {
      return '00:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFinishQuiz = async () => {
    if (showUsernameInput) {
      if (username.trim() === '') {
        alert('Please enter a username to start the quiz.');
        return;
      }

      setShowUsernameInput(false);
    } else {
      const playerName = username;
      const playerScore = points;

      const score = {
        name: playerName,
        score: playerScore,
      };

      saveHighScore(score);
      let scores;
      try {
        const existingScores = await AsyncStorage.getItem('@scores');
        if (existingScores !== null) {
          scores = JSON.parse(existingScores);
        } else {
          scores = [];
        }
      } catch (e) {
        console.error('Failed to load the scores:', e);
      }

      scores.push(score); 

      try {
        await AsyncStorage.setItem('@scores', JSON.stringify(scores));
      } catch (e) {
        console.error('Failed to save the scores:', e);
      }

      navigation.navigate('Home');
    }
  };

  const toggleSoundMute = () => {
    setIsSoundMuted((prevMuted) => !prevMuted);
  };

  const playCorrectSound = async () => {
    if (!isSoundMuted) {
      try {
        await correctAudio.unloadAsync();
        await correctAudio.loadAsync(correctSound);
        await correctAudio.playAsync();
      } catch (error) {
        console.error('Error playing correct sound:', error);
      }
    }
  };

  const playIncorrectSound = async () => {
    if (!isSoundMuted) {
      try {
        await incorrectAudio.unloadAsync();
        await incorrectAudio.loadAsync(incorrectSound);
        await incorrectAudio.playAsync();
      } catch (error) {
        console.error('Error playing incorrect sound:', error);
      }
    }
  };

  if (showUsernameInput) {
    return (
      <LinearGradient
        colors={['#7F0000', '#FF4500', '#FF8C00', '#FFA500', '#FFD700']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.usernameContainer}>
            <Text>Enter your username:</Text>
            <TextInput
              style={styles.usernameInput}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
            />
          </View>
          <Pressable style={styles.startButton} onPress={handleFinishQuiz}>
            <Text style={styles.buttonText}>Start Quiz</Text>
          </Pressable>
          <Pressable
            style={styles.homeButtonUsername}
            onPress={() => navigation.navigate('Home')}
          >
            <Icon name="home" size={36} color="black" />
          </Pressable>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading questions...</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <LinearGradient
        colors={['#7F0000', '#FF4500', '#FF8C00', '#FFA500', '#FFD700']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContentContainer}>
            <View style={styles.noQuestionsContainer}>
              <Text style={styles.noQuestionsText}>Final Score</Text>
              <Text style={styles.mistakesHeaderText}>Mistakes: {mistakes.length}</Text>
              <Text style={styles.mistakesHeaderText}>Mistaken Questions:</Text>
            </View>
            {mistakes.map((question, index) => (
              <View key={index} style={styles.mistakenQuestionContainer}>
                <Text style={styles.mistakenQuestionText}>{decode(question.question)}</Text>
                <Text style={styles.mistakenQuestionAnswer}>
                  Correct Answer: {decode(question.correct_answer)}
                </Text>
              </View>
            ))}
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsText}>
                {username} scored: {points} points
              </Text>
            </View>
            <Pressable style={styles.button} onPress={handleFinishQuiz}>
              <Text style={styles.buttonText}>Finish Quiz</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const answerOptions = currentQuestion.answerOptions;

  return (
    <LinearGradient
      colors={['#7F0000', '#FF4500', '#FF8C00', '#FFA500', '#FFD700']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
          <View>
            <Text style={styles.question}>{decode(currentQuestion.question)}</Text>
          </View>
          <View style={styles.optionsContainer}>
            {answerOptions.map((option, index) => (
              <Pressable
                key={index}
                style={[
                  styles.option,
                  selectedOption === option && { backgroundColor: 'green' },
                  answerStatus === 'incorrect' &&
                    selectedOption === option &&
                    selectedOption !== currentQuestion.correct_answer && { backgroundColor: 'red' },
                  answerStatus === 'incorrect' &&
                    option === currentQuestion.correct_answer && { backgroundColor: 'green' },
                ]}
                onPress={() => handleAnswerOption(option)}
                disabled={answerStatus !== null}
              >
                <Text style={styles.optionText}>
                  {String.fromCharCode(97 + index)}. {decode(option)}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.timeText}>Time: {formatTime(timer)}</Text>
          <Text>Points: {points}</Text>
          <Pressable style={styles.homeButton} onPress={handleFinishQuiz}>
            <Icon name="home" size={26} color="black" />
          </Pressable>
          <View style={styles.soundButtonContainer}>
            <Pressable onPress={toggleSoundMute}>
              {isSoundMuted ? (
                <Icon name="volume-mute" size={24} color="black" />
              ) : (
                <Icon name="volume-up" size={24} color="black" />
              )}
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    // borderWidth: 2,
    // borderColor: 'black',
    padding: 10,
  },
  optionsContainer: {
    marginTop: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'lightgray',
    borderWidth: 2,
    borderColor: 'black',
  },
  optionText: {
    marginLeft: 8,
  },
  mistakenQuestionContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 8,
  },
  mistakenQuestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mistakenQuestionAnswer: {
    fontSize: 14,
    fontWeight: '600',
  },
  noQuestionsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  noQuestionsText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  mistakesHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pointsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homeButton: {
    position: 'absolute',
    top: 10,
    right: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  homeButtonUsername:{
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',

  },
  homeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  usernameContainer: {
    marginBottom: 20,
    
  },
  usernameInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 8,
    backgroundColor: 'gold',
  },
  startButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'black',
    borderRadius: 8,
  },
  soundButtonContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
  },
  gradient: {
    flex: 1,
  },
  
});

export default QuizScreen;
