import React from 'react';
import {
  Text,
  ListView,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { Card } from 'react-native-elements';
import axios from 'axios';
import crawler from '../utils/crawler';
import FitImage from 'react-native-fit-image';
import ui from '../utils/ui';
import ParallaxView from 'react-native-parallax-view';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Native from '../utils/native';
import Storage from '../utils/storage';

export default class PickGirlsPage extends React.Component {

  static navigationOptions = {
    title: '', 
    header: { visible: true } 
  };

  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource,
      page: Math.floor(Math.random() * 200) + 1,
      host: 'http://xkcn.info/',
      host2: 'http://sose.xyz/',
      girls: [],
      source: null,
      loading: false,
      timeOut: null,
      loadMore: false,
      loadMoreBack: false,
      background: null,
      width: ui.size.width,
      contextMenu: false,
      selected: null,
    }
  }

  componentDidMount() {
    const { host, page } = this.state;
    let url = (page == 1) ? host : `${host}page/${page}`;

    this.loadGirls(url, page);
  }

  loadGirls(url, page) {
    const { dataSource, loading } = this.state;

    if(!loading) {
      this.setState({
        loading: true,
      });

      axios({method: 'GET', url, params: { }})
      .then(async (response) => {
        let { girls, host2 } = this.state;
        let newGirls = crawler.crawlGirls(response.data);
        let url2 = (page == 1) ? host2 : `${host2}page/${page}`;
        axios({method: 'GET', url: url2, params: { }})
        .then(async (response) => {
          let newGirls2 = crawler.crawlGirls2(response.data);

          newGirls2 = newGirls.concat(newGirls2);
          let source = dataSource.cloneWithRows(newGirls2);
          let index = Math.floor(Math.random() * newGirls2.length) + 1;
          this.setState({
            girls: newGirls2,
            source,
            loading: false,
            page,
            background: newGirls2[index].url
          });
          girls = girls.concat(newGirls);

        }).catch((error) => {
          console.warn(error);
          this.setState({
            loading: false,
          });
        });
      })
      .catch((error) => {
        console.warn(error);
        this.setState({
          loading: false,
        });
      });
    }
  }

  async addBookmark() {
    const { selected } = this.state;

    if (selected && selected != '') {
      await Storage.savebookmark({url: selected, title: ''});
    }
    this.setState({
      selected: null,
      contextMenu: false
    });
  }

  async saveImage() {
    const { selected } = this.state;
    if (selected && selected != '') {
      await Native.saveFile(selected);
    }
    this.setState({
      selected: null,
      contextMenu: false
    });
  }
  
  async copyImage() {
    const { selected } = this.state;

    if (selected && selected != '') {
      await Native.copyFile(selected);
    }
    this.setState({
      selected: null,
      contextMenu: false
    });
  }

  async copyUrl() {
    const { selected } = this.state;

    if (selected && selected != '') {
      await Native.copyUrl(selected);
    }
    this.setState({
      selected: null,
      contextMenu: false
    });
  }

  async shareImage() {
    const { selected } = this.state;

    if (selected && selected != '') {
      await Native.shareImage(selected);
    }
    this.setState({
      selected: null,
      contextMenu: false
    });
  }

  async shareUrl() {
    const { selected } = this.state;

    if (selected && selected != '') {
      await Native.shareUrl(selected);
    }
    this.setState({
      selected: null,
      contextMenu: false
    });
  }

  renderContextMenu() {
    const { contextMenu } = this.state;

    return contextMenu && (<ActionButton 
      buttonColor="rgba(233, 82, 92, 1)" 
      buttonText=''
      position='left' 
      onReset={() => {
        this.setState({
          selected: null,
          contextMenu: false
        });
      }}
      offsetY={-100}
      verticalOrientation='down'
      active={true}>
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
      </ActionButton>)
  }

  renderLoading() {
    return (<ActivityIndicator
      color='#E9525C'
      style={[styles.centering, {height: 80}]}
      size="large"
    />);
  }

  _onChooseGirl(girl, girls) {
    const { navigation } = this.props;
    let images = [];
    let list = [];

    images.push({url: girl.url});
    list.push(girl);
    girls.map((item) => {
      images.push({url: item.url});
      list.push(item);
    });

    navigation.navigate('Girl', { images: images, girls: list });
  }

  renderPost(girl) {
    const { girls, width } = this.state;
    
    let numCol = (width < 800) ? 2 : parseInt(width / 400);
    return (
      <TouchableOpacity
        onLongPress ={async (e)=>{
          this.setState({
            selected: girl.url,
            contextMenu: true
          });
        }} 
        style={[styles.item, {width: ui.size.width / numCol - numCol * 4}]}  onPress={() => this._onChooseGirl(girl, girls)}>
          <FitImage 
            resizeMode='stretch'
            source={{uri: girl.url}}
          />
          <Text style={{marginBottom: 10}}>
          {girl.title}
          </Text>
      </TouchableOpacity>
      );
  }

  _onScroll(e) {
    const { timeOut } = this.state;

    let windowHeight = ui.size.height,
              height = e.nativeEvent.contentSize.height,
              offset = e.nativeEvent.contentOffset.y;
      if( windowHeight + offset >= height ) {
        if (!timeOut) {
          let time = setTimeout(() => {
            const { host, page, timeOut } = this.state;
      
            let next = Math.floor(Math.random() * 200) + 1 ;
            let url = (next <= 1) ? host : `${host}page/${next}`;

            this.refs.listView.scrollTo({x: 0,y: 0,animated: false});
            this.loadGirls(url, next);
            clearTimeout(timeOut);
            this.setState({
              timeOut: null,
              loadMore: false,
              loadMoreBack: false
            });
          }, 1000);
          this.setState({
            timeOut: time,
            loadMore: true,
            loadMoreBack: false
          });
        }
      } else if (offset <= 0) {
        
        if (!timeOut) {
          let time = setTimeout(() => {
            const { host, page, timeOut } = this.state;
      
            let next = Math.floor(Math.random() * 200) + 1;
            let url = (next <= 1) ? host : `${host}page/${next}`;

            this.refs.listView.scrollTo({x: 0,y: 0,animated: false});
            this.loadGirls(url, next);
            clearTimeout(timeOut);
            this.setState({
              timeOut: null,
              loadMore: false,
              loadMoreBack: false
            });
          }, 1000);
          this.setState({
            timeOut: time,
            loadMore: false,
            loadMoreBack: true
          });
        }
      } else {
        clearTimeout(timeOut);
        this.setState({
          timeOut: null,
          loadMore: false,
          loadMoreBack: false
        });
      }
  }

  loadMore() {
    const { host } = this.state;
    let next = Math.floor(Math.random() * 200) + 1;
    let url = (next == 1) ? host : `${host}page/${next}`;
    this.loadGirls(url, next, false);
  }

  renderBackground() {
    const { source, loadMore, background, loadMoreBack, width } = this.state;
    let { goBack } = this.props.navigation;

    let numCol = (width < 800) ? 2 : parseInt(width / 400);

    if (background && background != '') {
      return (
        <View>
        <Image source={{uri: background}} resizeMode='cover' style={styles.backgroundImg} />
        <ScrollView onScroll={(e) => this._onScroll(e)}>
          {loadMoreBack && (<View style={[styles.endList, {height: 80}]}>
            <ActivityIndicator
              color='#E9525C'
              style={[styles.centering, {height: 80}]}
              size="large"
            /></View>)}
          {source && (
            <ListView
              ref='listView'
              dataSource={source}
              renderRow={(row) => this.renderPost(row)}
              contentContainerStyle={styles.items}
              style={styles.itemsBox}
              pagingEnabled={false}
              pageSize={9999999}
            />)}
          <View style={[styles.endList, {height: 80}]}>{loadMore && (
            <ActivityIndicator
              color='#E9525C'
              style={[styles.centering, {height: 80}]}
              size="large"
            />)}</View>
        </ScrollView>
        {this.renderContextMenu()}
        </View>
      );
    } else {
      return (<View>
        <ScrollView ref='listPage' onScroll={(e) => this._onScroll(e)}>
         {loadMoreBack && (<View style={[styles.endList, {height: 80}]}>
            <ActivityIndicator
              color='#E9525C'
              style={[styles.centering, {height: 80}]}
              size="large"
            /></View>)}
          {source && (
            <ListView
              ref='listView'
              dataSource={source}
              renderRow={(row) => this.renderPost(row)}
              contentContainerStyle={styles.items}
              style={styles.itemsBox}
              pagingEnabled={false}
              pageSize={9999999}
            />)}
          <View style={[styles.endList, {height: 80}]}>{loadMore && (
            <ActivityIndicator
              color='#E9525C'
              style={[styles.centering, {height: 80}]}
              size="large"
            />)}</View>
        </ScrollView>
        {this.renderContextMenu()}
      </View>)
    }
  };

  render() {
    const { loading } = this.state;

    if (loading) {
      return (this.renderLoading());
    }

    return (this.renderBackground());
  }
}

var styles = StyleSheet.create({
    itemsBox: {
        marginLeft: 5,
        marginRight: 5,
        height: (ui.size.width < 800) ? 3500 : (ui.size.width < 1200) ? 3500 : 3000,
    },
    items: {
        flexDirection: 'column',
        flex: 1,
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    },
    item: {
        backgroundColor: '#F5FCFF',
        borderWidth: 0,
        borderColor: '#555',
        padding: 6,
        margin: 3
    },
    backgroundImg: {
      opacity: 0.4 , 
      flex: 1, 
      width: ui.size.width, 
      height: ui.size.height, 
      position: 'absolute', 
      left: 0, 
      top: 0 
    },
    centering: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      opacity: 1
    },
    endList: {
      flex: 1,
    }
});

