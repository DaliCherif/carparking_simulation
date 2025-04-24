import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Switch,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function ListUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const db = getFirestore();

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccess = async (userId, currentAccess) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { hasAccess: !currentAccess });
      fetchUsers(); // Refresh list
    } catch (error) {
      Alert.alert('Update Error', error.message);
    }
  };

  const handleGetInfo = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Permissions</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.matricule}>Matricule: {item.matricule}</Text>
            <View style={styles.switchContainer}>
              <Text style={{ color: item.hasAccess ? 'green' : 'red' }}>
                {item.hasAccess ? 'Access Granted' : 'No Access'}
              </Text>
              <Switch
                value={item.hasAccess}
                onValueChange={() => toggleAccess(item.id, item.hasAccess)}
              />
            </View>
            <TouchableOpacity style={styles.infoButton} onPress={() => handleGetInfo(item)}>
              <Text style={styles.infoText}>Get Info</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal to show user info */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>User Information</Text>
            {selectedUser && (
              <>
                <Text style={styles.infoItem}>Full Name: {selectedUser.fullName}</Text>
                <Text style={styles.infoItem}>Email: {selectedUser.email}</Text>
                <Text style={styles.infoItem}>Phone: {selectedUser.phone}</Text>
                <Text style={styles.infoItem}>Matricule: {selectedUser.matricule}</Text>
                <Text style={styles.infoItem}>Access: {selectedUser.hasAccess ? 'Yes' : 'No'}</Text>
              </>
            )}
            <TouchableOpacity
              style={[styles.infoButton, { backgroundColor: '#c0392b' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.infoText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ecf0f1',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
  },
  matricule: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoButton: {
    backgroundColor: '#2980b9',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'flex-start',
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    alignSelf: 'center',
  },
  infoItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2c3e50',
  },
});
