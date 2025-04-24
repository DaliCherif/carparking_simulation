// RoleSelection.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RoleSelection({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Authentification', { role: 'user' })}
      >
        <Text style={styles.buttonText}>Login as User</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Authentification', { role: 'admin' })}
      >
        <Text style={styles.buttonText}>Login as Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#34495e',
  },
  button: {
    backgroundColor: '#2980b9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
