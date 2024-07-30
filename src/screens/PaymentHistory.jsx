import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const payments = [
  // Sample data
  { id: '1', date: '2023-01-01', amount: '$1000', status: 'Paid' },
  { id: '2', date: '2023-02-01', amount: '$1000', status: 'Paid' },
];

const PaymentHistory = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.payment}>
            <Text style={styles.paymentDate}>{item.date}</Text>
            <Text style={styles.paymentAmount}>{item.amount}</Text>
            <Text style={styles.paymentStatus}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  payment: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
  },
  paymentDate: {
    fontSize: 18,
  },
  paymentAmount: {
    fontSize: 16,
    color: 'gray',
  },
  paymentStatus: {
    fontSize: 16,
    color: 'green',
  },
});

export default PaymentHistory;
