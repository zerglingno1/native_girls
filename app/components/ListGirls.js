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
      width: ui.size.width
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
        /*let source = dataSource.cloneWithRows(newGirls);
        this.setState({
          source,
        });*/
        let url2 = (page == 1) ? host2 : `${host2}page/${page}`;
        axios({method: 'GET', url: url2, params: { }})
        .then(async (response) => {
          let newGirls2 = crawler.crawlGirls2(response.data);

          newGirls2 = newGirls.concat(newGirls2);
          let source = dataSource.cloneWithRows(newGirls2);
          let index = parseInt(newGirls2.length / 2);
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
    return (<ActivityIndicator
      style={[styles.centering, {height: 80}]}
      size="large"
    />);
  }

  renderPost(girl) {
    const { _onChooseGirl } = this.props;
    const { girls, width } = this.state;
    
    let numCol = (width < 800) ? 2 : parseInt(width / 400);
    return (
      <TouchableOpacity style={[styles.item, {width: ui.size.width / numCol - numCol * 4}]}  onPress={() => _onChooseGirl(girl, girls)}>
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

  renderLoadingMore() {
    return (<View style={styles.popupCenter}>
      <ActivityIndicator
        style={[styles.centering, {height: 80}]}
        size="large"
      />
      <Text style={styles.textLoadMore}>Load more</Text>
    </View>);
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

  renderBackground() {
    const { source, loadMore, background, loadMoreBack, width } = this.state;

    let numCol = (width < 800) ? 2 : parseInt(width / 400);

    if (background && background != '') {
      return (
        <ParallaxView backgroundSource={{uri: background}}
                  style={styles.backgroundImage} onScroll={(e) => this._onScroll(e)} ref='listPage'>
        <ScrollView>
          {loadMoreBack && (<View style={[styles.endList, {height: 80}]}>
            <ActivityIndicator
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
              style={[styles.centering, {height: 80}]}
              size="large"
            />)}</View>
        </ScrollView>
      </ParallaxView>
      );
    } else {
      return (<View>
        <ScrollView ref='listPage' onScroll={(e) => this._onScroll(e)}>
         {loadMoreBack && (<View style={[styles.endList, {height: 80}]}>
            <ActivityIndicator
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
    popupCenter: {
      position: 'absolute',
      width: ui.size.width,
      height: 100,
      top: ui.size.width / 2 - 50,
      left: 0,
      //backgroundColor: '#CCCCCC',
      //opacity: 0.4,
      //backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
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

