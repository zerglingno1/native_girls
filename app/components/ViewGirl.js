import React from 'react';
import {
  Text,
  ActivityIndicator, 
  StyleSheet,
  View
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
//import FitImage from 'react-native-fit-image';

export default class ViewGirl extends React.Component {
  static navigationOptions = {
     title: 'Main', 
     header: { visible: false } 
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
    let { image } = this.props;
    return (
    <View style={styles.container}>
      {(images && images.length > 0) && (<ImageViewer style={styles.container} imageUrls={images}/>)}
    </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  image: {
    width: undefined,
    height: undefined
  }
});
