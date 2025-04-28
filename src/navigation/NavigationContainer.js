import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './AppStack';

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
};

export default AppNavigator;
