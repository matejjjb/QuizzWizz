import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const TriviaScreen = ({ onNextFact }) => {
  const [triviaFact, setTriviaFact] = useState('');

  useEffect(() => {
    const fetchTriviaFactOfTheDay = async () => {
      try {
        const response = await fetch('http://numbersapi.com/random/trivia');
        const data = await response.text();
        setTriviaFact(data);
      } catch (error) {
        console.error('Error fetching trivia fact:', error);
      }
    };

    fetchTriviaFactOfTheDay();
  }, []);

  const handleNextFact = async () => {
    try {
      const response = await fetch('http://numbersapi.com/random/trivia');
      const data = await response.text();
      setTriviaFact(data);
      onNextFact(data);
    } catch (error) {
      console.error('Error fetching trivia fact:', error);
    }
  };

  return (
    <View style={styles.container}>
       <Text >Numeric Trivia fact:  </Text>
      <View style={styles.quoteContainer}>
       
        <Text style={styles.quoteText}>{triviaFact}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNextFact}>
        <Text style={styles.buttonText}>Next Fact</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteContainer: {

    padding: 30,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triviaContainer: {
    flex: 1,
    marginRight: 10,
  },
  headingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 18,
  },
  button: {
  backgroundColor: 'red',
  padding: 12,
  borderRadius: 8,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TriviaScreen;
