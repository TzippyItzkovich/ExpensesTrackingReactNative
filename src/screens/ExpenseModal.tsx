import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet } from 'react-native';
import { Expense } from './types';

interface ExpenseModalProps {
  visible: boolean;
  onSave: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onCancel: () => void;
  expenseToEdit: Expense | null;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  visible,
  onSave,
  onEdit,
  onCancel,
  expenseToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title);
      setAmount(expenseToEdit.amount.toString());
      setDate(expenseToEdit.date);
    } else {
      setTitle('');
      setAmount('');
      setDate('');
    }
  }, [expenseToEdit]);

  const handleSave = () => {
    const newExpense: Expense = {
      id: expenseToEdit ? expenseToEdit.id : '',
      title,
      amount: parseFloat(amount),
      date,
    };

    if (expenseToEdit) {
      onEdit(newExpense);
    } else {
      onSave(newExpense);
    }

    setTitle('');
    setAmount('');
    setDate('');
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.heading}>{expenseToEdit ? 'Edit Expense' : 'Add Expense'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Date"
          value={date}
          onChangeText={(text) => setDate(text)}
        />

        <Button title={expenseToEdit ? 'Save' : 'Add'} onPress={handleSave} />
        <Button title="Cancel" onPress={onCancel} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 10,
    marginBottom: 10,
  },
});

export default ExpenseModal;
