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

export default class ViewGirlPage extends React.Component {
  static navigationOptions = {
     title: 'Main', 
     header: { visible: false } 
    };
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    let { params } = this.props.navigation.state;;

    return (
    <View style={styles.container}>
      {( params && params.images && params.images.length > 0 ) && 
      (<ImageViewer 
        style={styles.container} 
        imageUrls={params.images}
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
       <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
            <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
            <Icon name="md-done-all" style={styles.actionButtonIcon} />
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
