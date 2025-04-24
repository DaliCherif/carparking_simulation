import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ImageBackground } from 'react-native';
import { auth, db, realtimeDb } from '../../firebase.js'; // Adjust path as needed
import { doc, getDoc } from 'firebase/firestore';
import { ref, set } from 'firebase/database';

export default function Commande() {
  const [gateStatus, setGateStatus] = useState('closed');
  const [showButton, setShowButton] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccess = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Not Signed In', 'Please sign in to continue.');
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setHasAccess(data.hasAccess === true);
        }
      } catch (error) {
        console.error('Error fetching user access:', error);
      }

      setLoading(false);
    };

    fetchAccess();
  }, []);

  const sendServoCommand = async () => {
    try {
      await set(ref(realtimeDb, '/servoAngle'), 90); // Open gate
      console.log('Command sent to Firebase.');
    } catch (error) {
      console.error('Failed to send servo command:', error);
    }
  };

  const handleOpenGate = () => {
    if (!hasAccess) {
      Alert.alert('Access Denied', 'You do not have access to the parking.');
      return;
    }

    setGateStatus('open');
    setShowButton(false);
    sendServoCommand();

    setTimeout(() => {
      setGateStatus('closed');
      setShowButton(true);
      set(ref(realtimeDb, '/servoAngle'), 0); // Close gate
    }, 5000);
  };

  const gateImage =
    gateStatus === 'open'
      ? require('../../assets/open_gate.png')
      : require('../../assets/closed_gate.jpg');

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>Checking your access...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../../assets/parking.jpg')} style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.statusText}>
          {gateStatus === 'open' ? 'Gate is opening...' : 'Gate is closed.'}
        </Text>

        <Image source={gateImage} style={styles.image} />

        {showButton && (
          <TouchableOpacity style={styles.button} onPress={handleOpenGate}>
            <Text style={styles.buttonText}>Open Gate</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  image: {
    width: 250,
    height: 150,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
