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
     header: { visible: false } 
    };
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'profile',
      image: []
    }
  }

  changeTab(selectedTab) {
    const { navigation } = this.props;

    switch (selectedTab) {
      case 'pick':
        navigation.navigate('Pick');
      break;
      case 'feed':
        navigation.navigate('Random');
      break;
      default: 
        this.setState({ selectedTab });
      break;
    }
  }

  _onChooseGirl(girl, girls) {
    const { navigation } = this.props;
    let images = [];

    images.push({url: girl.url});
    girls.map((item) => {
      images.push({url: item.url});
    });

    this.setState({
      images
    });
    navigation.navigate('Girl', { images: images });
    //this.changeTab('feed');
  }

  render() {
    const { selectedTab, image } = this.state;

    return (
    <Tabs>
      <Tab
        titleStyle={{fontWeight: 'bold', fontSize: 10}}
        selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
        selected={selectedTab === 'feed'}
        title={selectedTab === 'feed' ? 'GIRL' : null}
        renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='favorite' size={25} />}
        renderSelectedIcon={() => <Icon color={'#6296f9'} name='favorite' size={20} />}
        onPress={() => this.changeTab('feed')}>
          <View/>
      </Tab>
      <Tab
        titleStyle={{fontWeight: 'bold', fontSize: 10}}
        selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
        selected={selectedTab === 'profile'}
        title={selectedTab === 'profile' ? 'Hot' : null}
        renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='whatshot' size={25} />}
        renderSelectedIcon={() => <Icon color={'#6296f9'} name='whatshot' size={20} />}
        onPress={() => this.changeTab('profile')}>
          {selectedTab == 'profile' && (<ListGirls _onChooseGirl={(girl, girls) => this._onChooseGirl(girl, girls)} selectedTab={selectedTab} />)}
      </Tab>
      <Tab
        titleStyle={{fontWeight: 'bold', fontSize: 10}}
        selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
        selected={selectedTab === 'pick'}
        title={selectedTab === 'pick' ? 'PICK ME' : null}
        renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='burst-mode' size={25} />}
        renderSelectedIcon={() => <Icon color={'#6296f9'} name='burst-mode' size={20} />}
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
