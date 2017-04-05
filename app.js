import React from 'react';
import { StackNavigator } from 'react-navigation';
import MainPage from './app/pages/MainPage';
import ViewGirlPage from './app/pages/ViewGirlPage';
import PickGirlsPage from './app/pages/PickGirlsPage';
import RamdomGirlsPage from './app/pages/RamdomGirlsPage';

export default App = StackNavigator({
  Home: { screen: MainPage }, 
  Girl: { screen: ViewGirlPage },
  Pick: { screen: PickGirlsPage },
  Random: { screen: RamdomGirlsPage },
}, {
  headerMode: 'screen' 
});