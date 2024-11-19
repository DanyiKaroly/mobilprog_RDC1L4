import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { Picker } from '@react-native-picker/picker';
import CheckBox from 'react-native-checkbox';




const firebaseConfig = {
  apiKey: "AIzaSyAgKquAQ8FTBm3yI37kxBHG9NRWt557YNY",
  authDomain: "rdc1l4ma.firebaseapp.com",
  projectId: "rdc1l4ma",
  storageBucket: "rdc1l4ma.appspot.com",
  messagingSenderId: "366060552560",
  appId: "1:366060552560:android:013f0b1223462c411fcfb5",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const db = getFirestore();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthScreen({ navigation }) {
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const email = inputValue.includes('@') ? inputValue : `${inputValue}@rdc1l4.com`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Registration Successful', 'Account created!');
      handleLogin();
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const email = inputValue.includes('@') ? inputValue : `${inputValue}@rdc1l4.com`;
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login Successful', 'Logged in!');
      navigation.navigate('Main'); 
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <ImageBackground source={require('./assets/backgroundimage.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <TextInput
          style={styles.input}
          placeholder="Username/Email"
          placeholderTextColor="#ccc"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary} onPress={handleSignUp}>
          <Text style={styles.buttonSecondaryText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}


function DataSet({ onDescriptionSaved }) {
  const [description, setDescription] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");

  const handleSaveDescription = () => {
    if (description.trim() === "") {
      Alert.alert("Error", "The description field must be filled out!");
      return;
    }

    const bookingDetails = {
      day: selectedDay,
      description,
    };

    onDescriptionSaved(bookingDetails);
    Alert.alert("Save Completed: ", `${selectedDay}`);
    setDescription("");
  };

  return (
    <ImageBackground source={require('./assets/backgroundimage.jpg')} style={styles.background}>
    <View style={styles.container}>
      <Text style={styles.title}>Add Text</Text>
      <Picker
        selectedValue={selectedDay}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedDay(itemValue)}
      >
        <Picker.Item label="Monday" value="Monday" />
        <Picker.Item label="Tuesday" value="Tuesday" />
        <Picker.Item label="Wednesday" value="Wednesday" />
        <Picker.Item label="Thursday" value="Thursday" />
        <Picker.Item label="Friday" value="Friday" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Add Text"
        placeholderTextColor="#ccc"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveDescription}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}


function ProfileScreen({ navigation }) {
  const [newPassword, setNewPassword] = useState('');
  const auth = getAuth();

  const handleChangePassword = async () => {
    if (newPassword.trim() === '') {
      Alert.alert('Error', 'Enter a new password');
      return;
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert('Password Updated', 'Your password has been changed.');
      await signOut(auth);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate('Home');
  };

  return (
    <ImageBackground source={require('./assets/backgroundimage.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#ccc"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}





function DayScreen({ dayName, notifications = [] }) { 
  const [savedText] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [dayNotifications, setDayNotifications] = useState([]);

  useEffect(() => {
    if (Array.isArray(notifications)) {
      const filteredNotifications = notifications.filter(
        (notification) => notification.day === dayName
      );
      setDayNotifications(filteredNotifications);
    } else {
      setDayNotifications([]);
    }
  }, [dayName, notifications]);

  return (
    <ImageBackground source={require('./assets/backgroundimage.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>{dayName}</Text>
        
        {dayNotifications.length === 0 ? (
          <Text style={styles.white}>No notifications for this day.</Text>
        ) : (
          dayNotifications.map((notification, index) => (
            <View key={index} style={styles.notificationContainer}>
              <Text style={styles.white}>
                <Text style={styles.white}>{notification.day}: </Text>
                {notification.description }
              </Text>
            </View>
          ))
        )}
        
        <Text style={styles.textContent}>{savedText}</Text>
        
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={checkboxChecked}
            onValueChange={setCheckboxChecked}
            style={styles.checkbox}
            label='Completed'
          />
        </View>
      </View>
    </ImageBackground>
  );
}






function MainTabs({ handleDataConfirmed, notifications }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#333' },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#ccc',
        tabBarIcon: () => null,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="setter"
        children={() => <DataSet onDescriptionSaved={handleDataConfirmed} />}
        options={{ tabBarLabel: 'Add Text' }}
      />

      <Tab.Screen
        name="Monday"
        children={() => <DayScreen dayName="Monday" notifications={notifications} />}
      />
      <Tab.Screen
        name="Tuesday"
        children={() => <DayScreen dayName="Tuesday" notifications={notifications} />}
      />
      <Tab.Screen
        name="Wednesday"
        children={() => <DayScreen dayName="Wednesday" notifications={notifications} />}
      />
      <Tab.Screen
        name="Thursday"
        children={() => <DayScreen dayName="Thursday" notifications={notifications} />}
      />
      <Tab.Screen
        name="Friday"
        children={() => <DayScreen dayName="Friday" notifications={notifications} />}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}


export default function App() {
  const [notifications, setNotifications] = useState([]);

  const handleDataConfirmed = (bookingDetails) => {
    setNotifications((prevNotifications) => [...prevNotifications, bookingDetails]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Main"
          options={{ headerShown: false }}
        >
          {() => (
            <MainTabs
            handleDataConfirmed={handleDataConfirmed}
              notifications={notifications}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: 'white',
  },
  button: {
    backgroundColor: '#442cfc',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonSecondary: {
    backgroundColor: '#393939',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: 'white',
    fontSize: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  picker: {
    width: '100%',
    height: 50,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    color: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    color: 'white',
  },
  checkbox: {
    marginRight: 10,
    color: 'white',
  },
  checkboxLabel: {
    color: 'white',
    fontSize: 16,
  },
  notificationContainer: {
    padding: 10,
    marginVertical: 5,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    color: 'white',
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 5,
  },
  white:{
    color: 'white',
  }
});