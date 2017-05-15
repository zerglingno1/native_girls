import React from 'react';
import {
  Text,
  ActivityIndicator, 
  StyleSheet,
  View
} from 'react-native';
import { Tabs, Tab, Icon } from 'react-native-elements';
import ListGirls from '../components/ListGirls'
import RamdomGirls from '../components/RamdomGirls'

export default class MainPage extends React.Component {
  static navigationOptions = {
     title: 'Main', 
     header: false
    };
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'profile',
    }
  }

  changeTab(selectedTab) {
    const { navigation } = this.props;
    switch (selectedTab) {
      case 'pick':
        navigation.navigate('Pick');
      break;
      case 'book':
        navigation.navigate('Book');
      break;
      case 'feed':
        navigation.navigate('Sweet');
      break;
      default: 
        this.setState({ selectedTab });
      break;
    }
  }

  _onChooseGirl(girl, girls) {
    const { navigation } = this.props;
    let images = [];
    let list = [];

    list.push(girl);
    images.push({url: girl.url});
    girls.map((item) => {
      images.push({url: item.url});
      list.push(item);
    });

    navigation.navigate('Girl', { images: images, girls: list });
    //this.changeTab('feed');
  }

  render() {
    const { selectedTab, image } = this.state;

    return (
    <Tabs>
      <Tab
        selected={selectedTab === 'book'}
        renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='book' size={25} />}
        onPress={() => this.changeTab('book')}>
          <View/>
      </Tab>
      <Tab
        titleStyle={{fontWeight: 'bold', fontSize: 10}}
        selectedTitleStyle={{marginTop: -2, color: '#E9525C'}}
        selected={selectedTab === 'feed'}
        title={selectedTab === 'feed' ? 'SWEET' : null}
        renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='favorite' size={25} />}
        renderSelectedIcon={() => <Icon color={'#E9525C'} name='favorite' size={25} />}
        onPress={() => this.changeTab('feed')}>
          <View/>
      </Tab>
      <Tab
        titleStyle={{fontWeight: 'bold', fontSize: 10}}
        selectedTitleStyle={{marginTop: -2, color: '#E9525C'}}
        selected={selectedTab === 'profile'}
        title={selectedTab === 'profile' ? 'HOT' : null}
        renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='whatshot' size={25} />}
        renderSelectedIcon={() => <Icon color={'#E9525C'} name='whatshot' size={25} />}
        onPress={() => this.changeTab('profile')}>
          {selectedTab == 'profile' && (<ListGirls _onChooseGirl={(girl, girls) => this._onChooseGirl(girl, girls)} selectedTab={selectedTab} />)}
      </Tab>
      <Tab
        selected={selectedTab === 'pick'}
        renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='burst-mode' size={25} />}
        onPress={() => this.changeTab('pick')}>
          <View/>
      </Tab>
    </Tabs>);
  }
}

const styles = StyleSheet.create({
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});
