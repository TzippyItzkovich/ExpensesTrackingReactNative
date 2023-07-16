import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const [fullName, setFullName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    checkNameExists();
  }, []);

  const checkNameExists = async () => {
    const name = await AsyncStorage.getItem('fullName');
    if (name) {
      navigateToHome();
    }
  };

  const saveName = async () => {
    await AsyncStorage.setItem('fullName', fullName);
    navigateToHome();
  };

  const navigateToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={setFullName}
      />
      <Button title="Submit" onPress={saveName} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default WelcomeScreen;
