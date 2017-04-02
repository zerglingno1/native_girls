import React from 'react';
import {
  Text,
  ActivityIndicator, 
  StyleSheet
} from 'react-native';
import { Tabs, Tab, Icon } from 'react-native-elements';
import ListGirls from '../components/ListGirls'
import ViewGirl from '../components/ViewGirl'

export default class MainPage extends React.Component {
  static navigationOptions = {
     title: 'Main', 
     header: { visible: true } 
    };
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'profile',
      images: []
    }
  }

  changeTab(selectedTab) {
    this.setState({selectedTab})
  }

  _onChooseGirl(girl, girls) {
    let images = [];

    images.push({url: girl.url});
    girls.map((item) => {
      images.push({url: item.url});
    });

    this.setState({
      images
    });
    this.changeTab('feed');
  }

  render() {
    const { selectedTab, images } = this.state

    return (
    <Tabs>
      <Tab
        titleStyle={{fontWeight: 'bold', fontSize: 10}}
        selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
        selected={selectedTab === 'feed'}
        title={selectedTab === 'feed' ? 'FEED' : null}
        renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='whatshot' size={25} />}
        renderSelectedIcon={() => <Icon color={'#6296f9'} name='whatshot' size={20} />}
        onPress={() => this.changeTab('feed')}>
          <ViewGirl images={images} />
      </Tab>
      <Tab
        titleStyle={{fontWeight: 'bold', fontSize: 10}}
        selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
        selected={selectedTab === 'profile'}
        title={selectedTab === 'profile' ? 'PROFILE' : null}
        renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='person' size={25} />}
        renderSelectedIcon={() => <Icon color={'#6296f9'} name='person' size={20} />}
        onPress={() => this.changeTab('profile')}>
          <ListGirls _onChooseGirl={(girl, girls) => this._onChooseGirl(girl, girls)} />
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
