import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import { RootParamList } from './types';

const Tab = createBottomTabNavigator<RootParamList>();

const BottomTabsNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
          headerShown: false,
        }}/>
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
