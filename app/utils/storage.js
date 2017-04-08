import { AsyncStorage } from 'react-native';

const TABLE = {
  bookmarks: '@bookmarks'
};
export default {
  bookmarks: async () => {
    let bookmarks = await AsyncStorage.getItem(TABLE.bookmarks);
    return (bookmarks) ? JSON.parse(bookmarks) : [];
  },
  savebookmark: async (bookmark) => {
    let bookmarks = await AsyncStorage.getItem(TABLE.bookmarks);

    if (bookmarks) {
      bookmarks = JSON.parse(bookmarks);
      let book = bookmarks.filter((item) => {
        return item.url == bookmark.url;
      });

      if (book && book.length > 0) return false; 
    } else {
      bookmarks = [];
    }
    bookmarks.push(bookmark);
    await AsyncStorage.setItem(TABLE.bookmarks, JSON.stringify(bookmarks));
    return true;
  }
}