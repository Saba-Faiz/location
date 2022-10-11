import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import MainScreen from '../index';
import LocationList from '../flatlist';
const Stack = createNativeStackNavigator();

export default function Navigate() {
    return (<NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='MainScreen' component={MainScreen} options={{ headershown: false }}></Stack.Screen>
            <Stack.Screen name='LocationList' component={LocationList} options={{ headershown: false }}></Stack.Screen>
        </Stack.Navigator>
    </NavigationContainer>)

}