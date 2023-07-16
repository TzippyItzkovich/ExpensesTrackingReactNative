import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTotalExpenses();
  }, []);

  const fetchTotalExpenses = async () => {
    const expensesData = await AsyncStorage.getItem('expenses');
    if (expensesData) {
      const expenses = JSON.parse(expensesData);
      setTotalExpenses(expenses.length);
    }
  };

  const signOut = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.totalExpenses}>Total Expenses: {totalExpenses}</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalExpenses: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default ProfileScreen;
