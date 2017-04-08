import React from 'react';
import { StackNavigator } from 'react-navigation';
import MainPage from './app/pages/MainPage';
import ViewGirlPage from './app/pages/ViewGirlPage';
import PickGirlsPage from './app/pages/PickGirlsPage';
import BookmarksPage from './app/pages/BookmarksPage';
import RamdomGirls from './app/pages/RamdomGirlsPage';

export default App = StackNavigator({
  Home: { screen: MainPage }, 
  Girl: { screen: ViewGirlPage },
  Pick: { screen: PickGirlsPage },
  Book: { screen: BookmarksPage },
  Sweet: { screen: RamdomGirls },
}, {
  headerMode: 'screen' 
});