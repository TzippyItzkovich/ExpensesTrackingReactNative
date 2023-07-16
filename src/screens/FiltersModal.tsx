import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet } from 'react-native';

const FiltersModal = ({ visible, filters, onFilter, onClearFilters, onClose }) => {
  const [title, setTitle] = useState(filters.title);
  const [amount, setAmount] = useState(filters.amount);
  const [date, setDate] = useState(filters.date);

  const handleFilter = () => {
    const updatedFilters = {
      title: title.trim(),
      amount: amount.trim(),
      date: date.trim(),
    };
    onFilter(updatedFilters);
  };

  const handleClearFilters = () => {
    setTitle('');
    setAmount('');
    setDate('');
    onClearFilters();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.heading}>Filters</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => setTitle(text)}
            placeholder="Enter title"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={(text) => setAmount(text)}
            placeholder="Enter amount"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={(text) => setDate(text)}
            placeholder="Enter date"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Apply Filters" onPress={handleFilter} />
          <Button title="Clear Filters" onPress={handleClearFilters} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default FiltersModal;
