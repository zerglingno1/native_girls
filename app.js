import React from 'react';
import { StackNavigator } from 'react-navigation';
import MainPage from './app/pages/MainPage';

export default App = StackNavigator({
  Home: { screen: MainPage }, 
}, {
  headerMode: 'screen' 
});