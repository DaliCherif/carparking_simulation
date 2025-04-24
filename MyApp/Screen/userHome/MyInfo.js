import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function MyInfo() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            Alert.alert('No user data found in Firestore.');
          }
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Authentification');
      })
      .catch((error) => {
        Alert.alert('Logout Failed', error.message);
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  return (
    <ImageBackground source={require('../../assets/parking.jpg')} style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.title}>My Info</Text>

      <Text style={styles.label}>Full Name:</Text>
      <Text style={styles.value}>{userData?.fullName || 'N/A'}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{auth.currentUser?.email}</Text>

      <Text style={styles.label}>Phone:</Text>
      <Text style={styles.value}>{userData?.phone || 'N/A'}</Text>

      <Text style={styles.label}>Matricule de Voiture:</Text>
      <Text style={styles.value}>{userData?.matricule || 'N/A'}</Text>

      <Text style={styles.label}>Access Status:</Text>
      <Text style={[styles.value, { color: userData?.hasAccess ? 'green' : 'red' }]}>
        {userData?.hasAccess ? '✅ Access Granted' : '❌ You don’t have access to the parking'}
      </Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Deconnect</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,    
    flex: 1,
    padding: 20,
    
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    color: 'white',
  },
  value: {
    fontSize: 16,
    color: 'white',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
    opacity: 0.6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
