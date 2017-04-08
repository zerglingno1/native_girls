'use strict';

import React, { Component } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  ListView,
  Image, 
  TouchableOpacity } from 'react-native';
import Storage from '../utils/storage';
import ui from '../utils/ui';
import Native from '../utils/native';

export default class BookmarksPage extends Component{
  constructor() {
    super();
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource,
      images: [],
      source: null,
      background: null,
    }
  }

  componentWillMount() {
    this.loadBookmarks();
  }

  async loadBookmarks() {
    const { dataSource } = this.state;

    let books = await Storage.bookmarks();
    let source = (books && books.length > 0) ? dataSource.cloneWithRows(books) : null;
    let index = (books && books.length > 1) ? Math.floor(Math.random() * books.length) + 1 : (books.length == 1) ? 0 : null;
    this.setState({
      images: books,
      background: (index != null) ? books[index].url : null,
      source
    });
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

  render() {
    const { source, dataSource, background } = this.state;
      
    return(
      <ScrollView style={styles.container}>
        {background && (
          <Image source={{uri: background}} resizeMode='cover' style={styles.backgroundImg} />)}
        {source && (<ListView
          style={styles.recordList}
          enableEmptySections = {true} 
          dataSource={source}
          contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-around',}}
          renderRow={(rowData) => {
            const { images } = this.state;

            return (<TouchableOpacity 
              onLongPress ={async (e)=>{
                await Native.saveFile(rowData.url);
              }} 
              underlayColor={'#bbb'} onPress={() => this._onChooseGirl(rowData, images)}>
                <View style={styles.recordItem}>
                  <Image style={styles.recordItemImage} resizeMode='cover' source={{uri: rowData.url}} />
                </View>
              </TouchableOpacity>)
          }
          }/>)}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    flexDirection: 'row',
  },
  recordList: {
    flex: 1,
    width: ui.size.width,
    height: ui.size.height - 60,
  },
  recordItem: {
    height: 200,
    width: 200,
    backgroundColor: '#f3f3f3',
    marginTop: 10, marginBottom: 10,
    flexDirection: 'row',
  },
  recordItemImage:{
    flex: 1, 
    margin: 5
  },
  backgroundImg: {
    opacity: 0.4 ,
    flex: 1, 
    width: ui.size.width, 
    height: ui.size.height, 
    position: 'absolute', 
    left: 0, 
    top: 0
  }
});

