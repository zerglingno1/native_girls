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
import { Icon, Card } from 'react-native-elements';
import axios from 'axios';
import crawler from '../utils/crawler';
import FitImage from 'react-native-fit-image';
import ui from '../utils/ui';
import ParallaxView from 'react-native-parallax-view';
import Native from '../utils/native';
import ActionButton from 'react-native-action-button';
import VectorIcon from 'react-native-vector-icons/Ionicons';
import Storage from '../utils/storage';

export default class ListGirls extends React.Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource,
      page: 1,
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

  renderLoading() {
    return (<View style={[styles.centering, {flex: 1, width: undefined, height: undefined}]}><ActivityIndicator
      color='#E9525C'
      style={[styles.centering, {height: 80}]}
      size="large"
    /></View>);
  }

  renderPost(girl) {
    const { _onChooseGirl } = this.props;
    const { girls, width } = this.state;
    
    let numCol = (width < 800) ? 2 : parseInt(width / 400);
    return (
      <TouchableOpacity 
        style={[styles.item, {width: ui.size.width / numCol - numCol * 4}]}  
        onPress={() => _onChooseGirl(girl, girls)}
        delayLongPress={1000}
        onLongPress ={async (e)=>{
          this.setState({
            selected: girl.url,
            contextMenu: true
          });
        }}
        >
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
    const { selectedTab } = this.props;

    if (selectedTab == 'profile') {
      let windowHeight = ui.size.height,
              height = e.nativeEvent.contentSize.height,
              offset = e.nativeEvent.contentOffset.y;
      if( windowHeight + offset >= height ) {
        //console.warn( windowHeight + offset + '  ====  ' +  height);
        if (!timeOut) {
          let time = setTimeout(() => {
            const { host, page, timeOut } = this.state;
      
            let next = Number(page) + 1;
            let url = (next <= 1) ? host : `${host}page/${next}`;

            this.refs.listView.scrollTo({x: 0,y: 0,animated: false});
            this.refs.listPage.scrollTo({x: 0,y: 0,animated: false});
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
      
            let next = Number(page) - 1;
            let url = (next <= 1) ? host : `${host}page/${next}`;

            this.refs.listView.scrollTo({x: 0,y: 0,animated: false});
            this.refs.listPage.scrollTo({x: 0,y: 0,animated: false});
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
          <VectorIcon name="md-bookmark" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#9b59b6' title="Save" onPress={() => { this.saveImage() }}>
          <VectorIcon name="md-download" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#9b59b6' title="Copy Link" onPress={() => { this.copyUrl() }}>
          <VectorIcon name="ios-link" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#3498db' title="Copy Local" onPress={() => { this.copyImage() }}>
          <VectorIcon name="md-copy" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#3498db' title="Share Image" onPress={() => { this.shareImage() }}>
          <VectorIcon name="md-images" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#1abc9c' title="Share Url" onPress={() => { this.shareUrl() }}>
          <VectorIcon name="md-share" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#1abc9c' title="Back" onPress={() => { goBack(null) }}>
          <VectorIcon name="md-arrow-round-back" size={20} color='#ffffff' style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>)
  }

  renderBackground() {
    const { source, loadMore, background, loadMoreBack, width } = this.state;

    let numCol = (width < 800) ? 2 : parseInt(width / 400);

    if (background && background != '') {
      return (<View style={{flex: 1, width: undefined, height: undefined}}>
          <ParallaxView backgroundSource={{uri: background}}
                    style={styles.backgroundImage} onScroll={(e) => this._onScroll(e)} ref='listPage'>
          <ScrollView>
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
        </ParallaxView>
        {this.renderContextMenu()}
      </View>);
    } else {
      return (<View>
        {this.renderContextMenu()}
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
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
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
    centering: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      opacity: 1
    },
    textLoadMore: {
      flex: 1,
      color: 'black',
      opacity: 1
    },
    endList: {
      flex: 1,
    }
});

