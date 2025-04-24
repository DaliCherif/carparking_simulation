import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';  // Importing getAuth to get the current user

export default function ListPlaces() {
  const db = getDatabase();  // Initialize Firebase Realtime Database
  const auth = getAuth();  // Initialize Firebase Authentication
  const user = auth.currentUser;  // Get the current authenticated user
  const [spots, setSpots] = useState([]);

  // Initialize parking spots in Firebase Realtime Database
  useEffect(() => {
    if (!user) {
      console.log('No user is authenticated');
      return; // If no user is logged in, we do not proceed
    }

    // Define the reference to the parking spots in the Firebase Realtime Database
    const spotsRef = ref(db, '/places'); // The path '/places' in Firebase RTDB contains the parking spots' state

    // Listen for changes in the Realtime Database
    const unsubscribe = onValue(spotsRef, (snapshot) => {
      const data = snapshot.val();
      const fetchedSpots = [];
      for (let i = 1; i <= 10; i++) {
        // Check if the spot exists and update the state accordingly
        const spotState = data ? data[`place${i}`] : false;
        fetchedSpots.push({
          id: `spot_${i}`,
          occupiedBy: spotState ? 'OCCUPIED' : 'EMPTY', // If occupied, show "OCCUPIED", otherwise "EMPTY"
        });
      }
      console.log('Fetched spots:', fetchedSpots);
      setSpots(fetchedSpots);  // Update the spots state
    });

    return () => unsubscribe();  // Cleanup the listener on unmount
  }, [user]); // Add user as dependency to trigger effect when user changes

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You need to be logged in to view parking spots</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Parking Spots</Text>
      <View style={styles.grid}>
        {spots.map((spot) => (
          <View
            key={spot.id}
            style={[
              styles.spot,
              spot.occupiedBy === 'OCCUPIED' ? styles.occupiedSpot : styles.availableSpot,
            ]}
          >
            <Text style={styles.spotText}>{spot.id.replace('spot_', '')}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  spot: {
    width: 60,
    height: 60,
    margin: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  availableSpot: {
    backgroundColor: 'green',
  },
  occupiedSpot: {
    backgroundColor: 'red',
  },
});
