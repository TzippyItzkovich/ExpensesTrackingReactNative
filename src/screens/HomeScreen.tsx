import React, { useEffect, useState } from 'react';
import { View, Text, Button, SectionList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpenseModal from './ExpenseModal';
import FiltersModal from './FiltersModal';
import { Expense } from './types';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
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
      title: name,
      tabBarLabel: "Home",
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
    const sortedExpenses = sortExpensesByDate(updatedExpenses);
    await AsyncStorage.setItem('expenses', JSON.stringify(sortedExpenses));
    setExpenses(sortedExpenses);
    hideExpenseModal();
    calculateTotalAmount(sortedExpenses);
  };

  const editExpense = async (updatedExpense) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    const sortedExpenses = sortExpensesByDate(updatedExpenses);
    await AsyncStorage.setItem('expenses', JSON.stringify(sortedExpenses));
    setExpenses(sortedExpenses);
    hideExpenseModal();
  };

  const removeExpense = async (expenseId) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== expenseId);
    const sortedExpenses = sortExpensesByDate(updatedExpenses);
    await AsyncStorage.setItem('expenses', JSON.stringify(sortedExpenses));
    setExpenses(sortedExpenses);
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
    const sortedExpenses = sortExpensesByDate(filteredData);
    setExpenses(sortedExpenses);
    hideFiltersModal();
    calculateTotalAmount(sortedExpenses);
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      amount: '',
      date: '',
    });
    fetchData();
  };

  const sortExpensesByDate = (expenses: Expense[]) => {
    return expenses.sort((a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
      <View style={styles.headerContainer}>
        <Text style={styles.totalAmount}>Total amount spent: {totalAmount}</Text>
      </View>
      <View style={styles.filterContainer}>
        <Button
          title="Filter Expenses"
          onPress={showFiltersModal}
        />
        <Ionicons
          name="filter"
          size={24}
          onPress={showFiltersModal}
          style={styles.filterIcon}
        />
      </View>
      <View style={styles.addExpenseButtonContainer}>
        <Button
          title="Add Expense"
          onPress={showExpenseModal}
        />
      </View>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButton: {
    marginRight: 10,
  },
  filterIcon: {
    marginLeft: 5,
  },
  addExpenseButtonContainer: {
    marginBottom: 10,
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
