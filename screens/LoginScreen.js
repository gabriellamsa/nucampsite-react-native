import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Text } from 'react-native';
import { CheckBox, Input, Button, Icon } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { baseUrl } from '../shared/baseUrl';
import logo from '../assets/images/logo.png';

const LoginTab = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleLogin = async () => {
    console.log('username:', username);
    console.log('password:', password);
    console.log('remember:', remember);
    if (remember) {
      try {
        await SecureStore.setItemAsync(
          'userinfo',
          JSON.stringify({
            username,
            password
          })
        );
      } catch (error) {
        console.log('Could not save user info', error);
      }
    } else {
      try {
        await SecureStore.deleteItemAsync('userinfo');
      } catch (error) {
        console.log('Could not delete user info', error);
      }
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userdata = await SecureStore.getItemAsync('userinfo');
        const userinfo = JSON.parse(userdata);
        if (userinfo) {
          setUsername(userinfo.username);
          setPassword(userinfo.password);
          setRemember(true);
        }
      } catch (error) {
        console.log('Could not fetch user info', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Input
        placeholder='Username'
        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
        onChangeText={(text) => setUsername(text)}
        value={username}
        containerStyle={styles.formInput}
        leftIconContainerStyle={styles.formIcon}
      />
      <Input
        placeholder='Password'
        leftIcon={{ type: 'font-awesome', name: 'key' }}
        onChangeText={(text) => setPassword(text)}
        value={password}
        containerStyle={styles.formInput}
        leftIconContainerStyle={styles.formIcon}
        secureTextEntry={true}
      />
      <CheckBox
        title='Remember Me'
        center
        checked={remember}
        onPress={() => setRemember(!remember)}
        containerStyle={styles.formCheckbox}
      />
      <View style={styles.formButton}>
        <Button
          onPress={() => handleLogin()}
          title='Login'
          buttonStyle={{ backgroundColor: '#5637DD' }}
          icon={
            <Icon
              name='sign-in'
              type='font-awesome'
              color='#fff'
              iconStyle={{ marginRight: 10 }}
            />
          }
        />
      </View>
      <View style={styles.formButton}>
        <Button
          onPress={() => navigation.navigate('Register')}
          title='Register'
          type='clear'
          icon={
            <Icon
              name='user-plus'
              type='font-awesome'
              color='blue'
              iconStyle={{ marginRight: 10 }}
            />
          }
          titleStyle={{ color: 'blue' }}
        />
      </View>
    </View>
  );
};

const RegisterTab = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [remember, setRemember] = useState(false);
  const [imageUrl, setImageUrl] = useState(baseUrl + 'images/logo.png');

  const handleRegister = async () => {
    const userInfo = {
      username,
      password,
      firstName,
      lastName,
      email,
      remember
    };
    console.log(JSON.stringify(userInfo));
    if (remember) {
      try {
        await SecureStore.setItemAsync(
          'userinfo',
          JSON.stringify({
            username,
            password
          })
        );
      } catch (error) {
        console.log('Could not save user info', error);
      }
    } else {
      try {
        await SecureStore.deleteItemAsync('userinfo');
      } catch (error) {
        console.log('Could not delete user info', error);
      }
    }
  };

  const getImageFromCamera = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraPermission.status === 'granted') {
      const capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1]
      });
      if (capturedImage.assets) {
        await processImage(capturedImage.assets[0].uri);
      }
    }
  };

  const processImage = async (imgUri) => {
    try {
      const processedImage = await ImageManipulator.manipulateAsync(
        imgUri,
        [{ resize: { width: 400, height: 400 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      console.log(processedImage);
      setImageUrl(processedImage.uri);
    } catch (error) {
      console.log('Error processing image', error);
    }
  };

  const getImageFromGallery = async () => {
    const mediaLibraryPermissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (mediaLibraryPermissions.status === 'granted') {
      const selectedImage = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1]
      });
      if (selectedImage.assets) {
        console.log(selectedImage.assets[0]);
        await processImage(selectedImage.assets[0].uri);
      }
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            loadingIndicatorSource={logo}
            style={styles.image}
          />
          <Button title='Camera' onPress={getImageFromCamera} />
          <Button title='Gallery' onPress={getImageFromGallery} />
        </View>
        <Input
          placeholder='Username'
          leftIcon={{ type: 'font-awesome', name: 'user-o' }}
          onChangeText={(text) => setUsername(text)}
          value={username}
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <Input
          placeholder='Password'
          leftIcon={{ type: 'font-awesome', name: 'key' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
          secureTextEntry={true}
        />
        <Input
          placeholder='First Name'
          leftIcon={{ type: 'font-awesome', name: 'user-o' }}
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <Input
          placeholder='Last Name'
          leftIcon={{ type: 'font-awesome', name: 'user-o' }}
          onChangeText={(text) => setLastName(text)}
          value={lastName}
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <Input
          placeholder='Email'
          leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <CheckBox
          title='Remember Me'
          center
          checked={remember}
          onPress={() => setRemember(!remember)}
          containerStyle={styles.formCheckbox}
        />
        <View style={styles.formButton}>
          <Button
            onPress={() => handleRegister()}
            title='Register'
            buttonStyle={{ backgroundColor: '#5637DD' }}
            icon={
              <Icon
                name='user-plus'
                type='font-awesome'
                color='#fff'
                iconStyle={{ marginRight: 10 }}
              />
            }
          />
        </View>
      </View>
    </ScrollView>
  );
};

const Tab = createBottomTabNavigator();

const LoginScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Login'
        component={LoginTab}
        options={{
          tabBarIcon: (props) => (
            <Icon
              name='sign-in'
              type='font-awesome'
              color={props.color}
              iconStyle={{ marginRight: 10 }}
            />
          )
        }}
      />
      <Tab.Screen
        name='Register'
        component={RegisterTab}
        options={{
          tabBarIcon: (props) => (
            <Icon
              name='user-plus'
              type='font-awesome'
              color={props.color}
              iconStyle={{ marginRight: 10 }}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    margin: 20
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    margin: 10
  },
  image: {
    width: 60,
    height: 60
  },
  formIcon: {
    marginRight: 10
  },
  formInput: {
    padding: 10
  },
  formCheckbox: {
    margin: 10,
    backgroundColor: null
  },
  formButton: {
    margin: 40
  }
});

export default LoginScreen;
