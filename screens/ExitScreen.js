import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ExitScreen = ({ navigation }) => {
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home'); 
      return true; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); 
  }, [navigation]);

  const handleExit = () => {
    BackHandler.exitApp(); 
  };

  const handleNo = () => {
    navigation.navigate('Home'); 
  };

  return (
    <LinearGradient
      colors={['#7F0000', '#FF4500', '#FF8C00', '#FFA500', '#FFD700']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Are you sure you want to exit the quiz?</Text>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title="Yes" onPress={handleExit} color="#00008B" />
          </View>
          <View style={styles.separator} />
          <View style={styles.button}>
            <Button title="No" onPress={handleNo} color="#00008B" />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    marginHorizontal: 8,
  },
  separator: {
    width: 8,
  },
  gradient: {
    flex: 1,
  },
});

export default ExitScreen;
