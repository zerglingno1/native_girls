import React from 'react';
import {
  Text,
  ActivityIndicator, 
  StyleSheet,
  View
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Storage from '../utils/storage';
import Native from '../utils/native';

export default class ViewGirlPage extends React.Component {
  static navigationOptions = {
     title: 'Main', 
     header: { visible: false } 
  };
  constructor(props) {
    super(props)
    this.state = {
      index: 0
    }
  }

  async addBookmark() {
    const { index } = this.state;
    const { params } = this.props.navigation.state;

    let girl = params.girls[index];
    await Storage.savebookmark(girl);
  }

  async saveImage() {
    const { index } = this.state;
    const { params } = this.props.navigation.state;

    let girl = params.girls[index];
    await Native.saveFile(girl.url);
  }
  
  async copyImage() {
    const { index } = this.state;
    const { params } = this.props.navigation.state;

    let girl = params.girls[index];
    await Native.copyFile(girl.url);
  }

  async copyUrl() {
    const { index } = this.state;
    const { params } = this.props.navigation.state;

    let girl = params.girls[index];
    Native.copyUrl(girl.url);
  }

  async shareImage() {
    const { index } = this.state;
    const { params } = this.props.navigation.state;

    let girl = params.girls[index];
    await Native.shareImage(girl.url);
  }

  async shareUrl() {
    const { index } = this.state;
    const { params } = this.props.navigation.state;

    let girl = params.girls[index];
    await Native.shareUrl(girl.url);
  }

  onchange(index) {
    this.setState({
      index
    });
  }

  render() {
    let { params } = this.props.navigation.state;
    let { goBack } = this.props.navigation;;

    return (
    <View style={styles.container}>
      {( params && params.images && params.images.length > 0 ) && 
      (<ImageViewer 
        style={styles.container} 
        imageUrls={params.images}
        onChange={(index) => this.onchange(index)}
        renderArrowLeft={() => (
          <View style={{width: 50, height: 50, zIndex: 99, marginLeft: 10}}>
            <Icon name='ios-arrow-back-outline' color='#ffffff' size={50} />
          </View>
        )}
        renderArrowRight={() => (
          <View style={{width: 50, height: 50,  zIndex: 99, marginRight: 10}}>
            <Icon name='ios-arrow-forward-outline' color='#ffffff' size={50} />
          </View>
        )}
      />)}
       <ActionButton buttonColor="rgba(233, 82, 92, 1)" position='left' outRangeScale={1.5}>
         <ActionButton.Item buttonColor='#E9525C' title="bookmark" onPress={() => { this.addBookmark() }}>
          <Icon name="md-bookmark" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#9b59b6' title="Save" onPress={() => { this.saveImage() }}>
          <Icon name="md-download" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#9b59b6' title="Copy Link" onPress={() => { this.copyUrl() }}>
          <Icon name="ios-link" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#3498db' title="Copy Local" onPress={() => { this.copyImage() }}>
          <Icon name="md-copy" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#3498db' title="Share Image" onPress={() => { this.shareImage() }}>
          <Icon name="md-images" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#1abc9c' title="Share Url" onPress={() => { this.shareUrl() }}>
          <Icon name="md-share" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#1abc9c' title="Back" onPress={() => { goBack(null) }}>
          <Icon name="md-arrow-round-back" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
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
