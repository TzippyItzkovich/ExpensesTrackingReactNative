import React, { useEffect, useState } from 'react';
import { View, Text, Button, SectionList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpenseModal from './ExpenseModal';
import FiltersModal from './FiltersModal';
import { Expense } from './types';

const HomeScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isExpenseModalVisible, setExpenseModalVisible] = useState(false);
  const [isFiltersModalVisible, setFiltersModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    amount: '',
    date: '',
  });
  const [expenseToEdit, setExpenseToEdit] = useState(undefined);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const name = await AsyncStorage.getItem('fullName');
    const expensesData = await AsyncStorage.getItem('expenses');
    if (expensesData) {
      const parsedExpenses = JSON.parse(expensesData);
      setExpenses(parsedExpenses);
      calculateTotalAmount(parsedExpenses);
    }
    setFullName(name);
    updateNavigationTitle(name);
  };

  const calculateTotalAmount = (data) => {
    let amount = 0;
    data.forEach((expense) => {
      amount += Number(expense.amount);
    });
    setTotalAmount(amount);
  };

  const updateNavigationTitle = (name) => {
    navigation.setOptions({
      title: `Welcome, ${name}`,
    });
  };

  const showExpenseModal = () => {
    setExpenseModalVisible(true);
  };

  const hideExpenseModal = () => {
    setExpenseModalVisible(false);
    setExpenseToEdit(undefined);
  };

  const showFiltersModal = () => {
    setFiltersModalVisible(true);
  };

  const hideFiltersModal = () => {
    setFiltersModalVisible(false);
  };

  const createExpense = async (newExpense) => {
    const updatedExpenses = [...expenses, newExpense];
    await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
    hideExpenseModal();
    calculateTotalAmount(updatedExpenses);
  };

  const editExpense = async (updatedExpense) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
    hideExpenseModal();
  };

  const removeExpense = async (expenseId) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== expenseId);
    await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
  };

  const filterExpenses = (filters) => {
    const filteredData = expenses.filter((expense) => {
      const titleMatch = filters.title
        ? expense.title.toLowerCase().includes(filters.title.toLowerCase())
        : true;
      const amountMatch =
        filters.amount !== '' ? Number(expense.amount) === Number(filters.amount) : true;
      const dateMatch =
        filters.date !== ''
          ? new Date(expense.date).toDateString() === new Date(filters.date).toDateString()
          : true;
      return titleMatch && amountMatch && dateMatch;
    });
    setExpenses(filteredData);
    hideFiltersModal();
    calculateTotalAmount(filteredData);
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      amount: '',
      date: '',
    });
    fetchData();
  };

  const renderItem = ({ item }) => (
    <View style={styles.expenseContainer} key={item.id}>
      <Text style={styles.expenseText}>{item.title}</Text>
      <Text style={styles.expenseText}>{item.amount}</Text>
      <Text style={styles.expenseText}>{item.date}</Text>
      <Button title="Edit" onPress={() => handleEditExpense(item)} />
      <Button title="Remove" onPress={() => handleRemoveExpense(item.id)} />
    </View>
  );

  const handleEditExpense = (expense) => {
    setExpenseToEdit(expense);
    setExpenseModalVisible(true);
  };

  const handleRemoveExpense = (expenseId) => {
    removeExpense(expenseId);
  };

  // Prepare the data for sectioning
  const sectionedExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toDateString();
    const section = acc.find((section) => section.title === date);
    if (section) {
      section.data.push(expense);
    } else {
      acc.push({ title: date, data: [expense] });
    }
    return acc;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, {fullName}</Text>
      <Text style={styles.totalAmount}>Total amount spent: {totalAmount}</Text>

      <Button title="Add Expense" onPress={showExpenseModal} />
      <Button title="Filter Expenses" onPress={showFiltersModal} />

      <SectionList
        sections={sectionedExpenses}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        keyExtractor={(item) => item.id}
      />

      <ExpenseModal
        visible={isExpenseModalVisible}
        onSave={createExpense}
        onEdit={editExpense}
        onCancel={hideExpenseModal}
        expenseToEdit={expenseToEdit}
      />

      <FiltersModal
        visible={isFiltersModalVisible}
        filters={filters}
        onFilter={filterExpenses}
        onClearFilters={clearFilters}
        onClose={hideFiltersModal}
      />
    </View>
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
  totalAmount: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  expenseContainer: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 10,
    marginBottom: 10,
  },
  expenseText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default HomeScreen;
