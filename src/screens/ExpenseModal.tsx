import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';
import { Expense } from './types';
import { v4 as uuidv4 } from 'uuid';

type ExpenseModalProps = {
  visible: boolean;
  onSave: (newExpense: Expense) => Promise<void>;
  onEdit: (updatedExpense: Expense) => Promise<void>;
  onCancel: () => void;
  expenseToEdit?: Expense; // Make expenseToEdit property optional
};

const ExpenseModal = ({ visible, onSave, onEdit, onCancel, expenseToEdit }: ExpenseModalProps) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title);
      setAmount(expenseToEdit.amount.toString());
      setDate(expenseToEdit.date);
    } else {
      clearFields();
    }
  }, [expenseToEdit]);

  const handleSave = () => {
    const newExpense = {
      id: expenseToEdit ? expenseToEdit.id : uuidv4(), // Assign a unique ID using uuidv4()
      title,
      amount: Number(amount),
      date,
    };
  
    if (expenseToEdit) {
      onEdit(newExpense);
    } else {
      onSave(newExpense);
    }
  
    clearFields();
  };  

  const clearFields = () => {
    setTitle('');
    setAmount('');
    setDate('');
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{expenseToEdit ? 'Edit Expense' : 'Add Expense'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Date"
          value={date}
          onChangeText={setDate}
        />
        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={onCancel} color="gray" />
          <Button title={expenseToEdit ? 'Update' : 'Save'} onPress={handleSave} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default ExpenseModal;
