import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet } from 'react-native';
import { Filters } from './types';

type Props = {
  visible: boolean;
  filters: Filters;
  onFilter: (filters: Filters) => void;
  onClearFilters: () => void;
  onClose: () => void;
};

const FiltersModal: React.FC<Props> = ({ visible, filters, onFilter, onClearFilters, onClose }) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const filterExpenses = () => {
    onFilter(localFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      title: '',
      minAmount: '',
      maxAmount: '',
      minDate: '',
      maxDate: '',
    });
    onClearFilters();
  };

  const handleClose = () => {
    setLocalFilters(filters);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.heading}>Filters</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={localFilters.title}
          onChangeText={(text) => setLocalFilters((prevFilters) => ({ ...prevFilters, title: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Min Amount"
          value={localFilters.minAmount}
          onChangeText={(text) => setLocalFilters((prevFilters) => ({ ...prevFilters, minAmount: text }))}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Max Amount"
          value={localFilters.maxAmount}
          onChangeText={(text) => setLocalFilters((prevFilters) => ({ ...prevFilters, maxAmount: text }))}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Min Date"
          value={localFilters.minDate}
          onChangeText={(text) => setLocalFilters((prevFilters) => ({ ...prevFilters, minDate: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Max Date"
          value={localFilters.maxDate}
          onChangeText={(text) => setLocalFilters((prevFilters) => ({ ...prevFilters, maxDate: text }))}
        />
        <View style={styles.buttonsContainer}>
          <Button title="Filter" onPress={filterExpenses} />
          <Button title="Clear Filters" onPress={handleClearFilters} />
          <Button title="Close" onPress={handleClose} />
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
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default FiltersModal;
