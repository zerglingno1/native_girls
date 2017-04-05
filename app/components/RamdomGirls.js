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
} from 'react-native';
import { Icon, Card } from 'react-native-elements';
import axios from 'axios';
import crawler from '../utils/crawler';
import FitImage from 'react-native-fit-image';
import ui from '../utils/ui';
import SwipeCards from 'react-native-swipe-cards';

export default class RamdomGirls extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: Math.floor(Math.random() * 200) + 1 ,
      host: 'http://xkcn.info/',
      host2: 'http://sose.xyz/',
      girls: [],
      source: null,
      loading: false,
      background: null,
      backgrounds: null,
      width: ui.size.width,
      outOfCards: false
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
          let { backgrounds } = this.state;
          let newGirls2 = crawler.crawlGirls2(response.data);
          newGirls2 = newGirls.concat(newGirls2);
          if (backgrounds) {
            backgrounds = backgrounds.concat(newGirls2);
          } else {
            backgrounds = newGirls2;
          }

          this.setState({
            loading: false,
            page,
            backgrounds,
            background: backgrounds[0].url
          });

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

  handleYup (card) {
  }
  handleNope (card) {
  }
  cardRemoved (index) {
    const { backgrounds } = this.state;

    if (index == backgrounds.length - 1) {
      let next = Math.floor(Math.random() * 200) + 1;
      let url = (next == 1) ? host : `${host}page/${next}`;
      this.loadGirls(url, next);
    } else {
      this.setState({
        backgrounds: backgrounds,
        background: backgrounds[index].url
    });
    }
  }

  renderBackground() {
    const { source, backgrounds, pagerDataSource, background } = this.state;

    return (<View style={{flex: 1, width: undefined, height: undefined, backgroundColor: 'black'}}>
      {background && (<Image source={{uri: background}} resizeMode='cover' style={{opacity: 0.4 ,flex: 1, width: ui.size.width, height: ui.size.height, position: 'absolute', left: 0, top: 0}} />)}
      <View style={[styles.centering, {width: ui.size.width, height: 500}]}>
        { backgrounds && backgrounds.length > 0 && (
          <SwipeCards
            cards={backgrounds}
            loop={true}

            renderCard={(cardData) => cardData && (
              <View style={styles.card}>
                <FitImage style={styles.thumbnail} source={{uri: cardData.url}} />
                <Text style={styles.text}>{cardData.title}</Text>
              </View>)}
            renderNoMoreCards={() => (<View style={styles.noMoreCards}>
              <Text>No more cards</Text>
            </View>)}
            showYup={false}
            showNope={false}
            handleYup={this.handleYup}
            handleNope={this.handleNope}
            cardRemoved={(index) => this.cardRemoved(index) }
        />)}
      </View>
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
        marginLeft: 0,
        marginRight: 0,
        height: 300
    },
    items: {
        flexDirection: 'column',
        flexWrap: 'wrap'
    },
    item: {
        backgroundColor: '#F5FCFF',
        borderWidth: 0,
        borderColor: '#555',
        padding: 6,
        margin: 3
    },
    card: {
      height: ui.size.height * 2 / 3 ,
      alignItems: 'center',
      borderRadius: 5,
      overflow: 'hidden',
      borderColor: 'grey',
      backgroundColor: 'white',
      borderWidth: 1,
      elevation: 1,
    },
    thumbnail: {
      flex: 1,
      width: (ui.size.width < 800) ? ui.size.width - 10 : 800,
      height: (ui.size.width < 800) ? ui.size.height * 2 / 3 : 800 ,
    },
    text: {
      fontSize: 20,
      paddingTop: 10,
      paddingBottom: 10
    },
    noMoreCards: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centering: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    }
});

