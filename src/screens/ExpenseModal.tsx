import React, { useState } from 'react';
import { View, TextInput, Button, Modal } from 'react-native';

const ExpenseModal = ({ visible, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const saveExpense = () => {
    const newExpense = {
      id: Math.random().toString(),
      title,
      amount,
      date,
    };
    onSave(newExpense);
  };

  return (
    <Modal visible={visible}>
      <View>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          placeholder="Date"
          value={date}
          onChangeText={setDate}
        />
        <Button title="Create/Save" onPress={saveExpense} />
        <Button title="Cancel" onPress={onCancel} />
      </View>
    </Modal>
  );
};

export default ExpenseModal;
