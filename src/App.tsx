/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
	SafeAreaView,
	StatusBar,
	Text,
	View,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator  } from '@react-navigation/material-top-tabs';
import MainScreen from './MainScreen';
import HistoryScreen from './HistoryScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator ()

const App = () => {

	Orientation.lockToPortrait()

	return (
		<SafeAreaView style={{ backgroundColor: "#fff", height: "100%"}}>
			<StatusBar barStyle={'dark-content'} backgroundColor={"#fff"} />
			<NavigationContainer>
				<Tab.Navigator initialRouteName={"Home"} tabBarPosition={"bottom"}>
					<Tab.Screen name="Home" component={MainScreen} />
					<Tab.Screen name="History" component={HistoryScreen} />
				</Tab.Navigator>
			</NavigationContainer>
		</SafeAreaView>
	);
};

export default App;
