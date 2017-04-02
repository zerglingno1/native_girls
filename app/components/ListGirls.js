import React from 'react';
import {
  Text,
  ListView,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator, 
  TouchableOpacity, 
} from 'react-native';
import { Icon, Card } from 'react-native-elements';
import axios from 'axios';
import crawler from '../utils/crawler';
import FitImage from 'react-native-fit-image';
import ui from '../utils/ui';

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
      countPage: 0,
      timeOut: null,
      loadMore: false
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

          newGirls2 = newGirls2.concat(newGirls);
          let source = dataSource.cloneWithRows(newGirls2);

          this.setState({
            girls: newGirls2,
            source,
            loading: false,
            page,
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
    const { girls } = this.state;
    
    return (
      <TouchableOpacity style={[styles.item]}  onPress={() => _onChooseGirl(girl, girls)}>
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

    let windowHeight = ui.size.height,
            height = e.nativeEvent.contentSize.height,
            offset = e.nativeEvent.contentOffset.y;
    if( windowHeight + offset >= height + 10 ) {
      if (!timeOut) {
        let time = setTimeout(() => {
          const { host, page, timeOut } = this.state;
    
          let next = page + 1;
          let url = (next <= 1) ? host : `${host}page/${next}`;

          this.refs.listView.scrollTo({x: 0,y: 0,animated: false});
          this.refs.listPage.scrollTo({x: 0,y: 0,animated: false});
          this.loadGirls(url, next);
          clearTimeout(timeOut);
          this.setState({
            timeOut: null,
            loadMore: false,
          });
        }, 1000);
        this.setState({
          timeOut: time,
          loadMore: true
        });
      }
    } else if (offset <= 0) {
      
      if (!timeOut) {
        let time = setTimeout(() => {
          const { host, page, timeOut } = this.state;
    
          let next = page - 1;
          let url = (next <= 1) ? host : `${host}page/${next}`;

          this.refs.listView.scrollTo({x: 0,y: 0,animated: false});
          this.refs.listPage.scrollTo({x: 0,y: 0,animated: false});
          this.loadGirls(url, next);
          clearTimeout(timeOut);
          this.setState({
            timeOut: null,
            loadMore: false,
          });
        }, 1000);
        this.setState({
          timeOut: time,
          loadMore: true
        });
      }
    } else {
      clearTimeout(timeOut);
      this.setState({
        timeOut: null,
        loadMore: false
      });
    }
  }

  render() {
    const { source, loading, loadMore } = this.state;

    if (loading) {
      return (this.renderLoading());
    }

    return (
      <View>
        <ScrollView ref='listPage' onScroll={(e) => this._onScroll(e)}>
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
          <View style={styles.endList}></View>
        </ScrollView>
        {loadMore && this.renderLoadingMore()}
      </View>
    );
  }
}

var styles = StyleSheet.create({
    itemsBox: {
        marginLeft: 5,
        marginRight: 5,
        height: (ui.size.width < 800) ? 3600 : 8000,
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
        width: ui.size.width / 2 - 10,
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
      height: 50
    }
});

