import React from 'react';
import {
  Text,
  ActivityIndicator, 
  StyleSheet,
  View
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class ViewGirl extends React.Component {
  static navigationOptions = {
     title: 'Main', 
     header: { visible: true } 
    };
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  changeTab(selectedTab) {
    this.setState({selectedTab})
  }

  render() {
    let { images } = this.props;

    console.warn(images.length);
    return (
    <View style={{flex: 1}}>
      {images && (<ImageViewer style={styles.container} imageUrls={images}/>)}
    </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    flex: 1,
    height: 500
  },
});
