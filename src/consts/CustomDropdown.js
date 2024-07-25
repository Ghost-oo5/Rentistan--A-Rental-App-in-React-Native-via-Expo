// src/consts/CustomDropdown.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomDropdown = ({ options, selectedOption, onSelect, label }) => {
  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={[styles.option, selectedOption === option && styles.selectedOption]}
          onPress={() => onSelect(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
          {selectedOption === option && <Icon name="check" size={20} color="#00ADEF" />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  dropdownLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 5,
  },
  selectedOption: {
    backgroundColor: '#e1f5fe',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomDropdown;
