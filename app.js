import React from 'react';
import { StackNavigator } from 'react-navigation';
import MainPage from './app/pages/MainPage';
import ViewGirlPage from './app/pages/ViewGirlPage';

export default App = StackNavigator({
  Home: { screen: MainPage }, 
  Girl: { screen: ViewGirlPage },
}, {
  headerMode: 'screen' 
});