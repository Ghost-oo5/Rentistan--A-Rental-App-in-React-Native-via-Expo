import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const InputField = ({ label, icon, keyboardType, inputType, fieldButtonLabel, fieldButtonFunction }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={styles.input}
          keyboardType={keyboardType}
          secureTextEntry={inputType === 'password'}
        />
        {fieldButtonLabel && (
          <TouchableOpacity onPress={fieldButtonFunction}>
            <Text style={styles.fieldButton}>{fieldButtonLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  fieldButton: {
    color: '#AD40AF',
    fontWeight: '700',
  },
});

export default InputField;
