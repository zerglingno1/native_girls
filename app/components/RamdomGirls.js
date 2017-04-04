import React from 'react';
import {
  Text,
  ListView,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator, 
  TouchableOpacity, 
  Image,
  Animated
} from 'react-native';
import { Icon, Card } from 'react-native-elements';
import axios from 'axios';
import crawler from '../utils/crawler';
import FitImage from 'react-native-fit-image';
import ui from '../utils/ui';
import ViewPager from 'react-native-viewpager';

export default class RamdomGirls extends React.Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const pagerDataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    });
    this.state = {
      dataSource,
      pagerDataSource,
      page: Math.floor(Math.random() * 200) + 1 ,
      host: 'http://xkcn.info/',
      host2: 'http://sose.xyz/',
      girls: [],
      source: null,
      loading: false,
      timeOut: null,
      loadMore: false,
      loadMoreBack: false,
      backgrounds: null,
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
          let backgrounds = newGirls.map((item) => item.url);

          newGirls2 = newGirls.concat(newGirls2);
          let source = dataSource.cloneWithRows(newGirls2);
          let index = parseInt(newGirls2.length / 2);
          this.setState({
            girls: newGirls2,
            source,
            loading: false,
            page,
            backgrounds
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
    
    return (
      <TouchableOpacity style={[styles.item, {width: width - 10}]}  onPress={() => _onChooseGirl(girl, girls)}>
          <FitImage 
            resizeMode='stretch'
            source={{uri: girl.url}}
            width={ width - 10 }
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

          this.refs.listView2.scrollTo({x: 0,y: 0,animated: false});
          this.refs.listPage2.scrollTo({x: 0,y: 0,animated: false});
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

          this.refs.listView2.scrollTo({x: 0,y: 0,animated: false});
          this.refs.listPage2.scrollTo({x: 0,y: 0,animated: false});
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

  renderPage (data, pageID) {
    return (
      <FitImage
        source={{uri: data}}
        style={styles.page} />
    );
  }

  renderBackground() {
    const { source, loadMore, backgrounds, loadMoreBack, pagerDataSource } = this.state;

    let sourceView = null;
    if (backgrounds) {
      sourceView = pagerDataSource.cloneWithPages(backgrounds);
    }

    return (<View>
      {sourceView && (
        <ViewPager
          dataSource={sourceView}
          renderPage={this.renderPage}
          isLoop={true}
          locked={false}
          autoPlay={true}
          />
      )}
        <ScrollView ref='listPage2' onScroll={(e) => this._onScroll(e)}>
         {loadMoreBack && (<View style={[styles.endList, {height: 80}]}>
            <ActivityIndicator
              style={[styles.centering, {height: 80}]}
              size="large"
            /></View>)}
          {source && (
            <ListView
              ref='listView2'
              dataSource={source}
              renderRow={(row) => this.renderPost(row)}
              contentContainerStyle={styles.items}
              style={styles.itemsBox}
            />)}
          <View style={[styles.endList, {height: 80}]}>{loadMore && (
            <ActivityIndicator
              style={[styles.centering, {height: 80}]}
              size="large"
            />)}</View>
        </ScrollView>
      </View>)
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
    page: {
      flex: 1,
    },
    itemsBox: {
        marginLeft: 5,
        marginRight: 5,
        height: undefined,
    },
    items: {
        flexDirection: 'row',
        flex: 1,
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    },
    item: {
        backgroundColor: '#F5FCFF',
        borderWidth: 0,
        borderColor: '#555',
        padding: 0,
        margin: 0,
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

