import { NativeModules, Clipboard, Platform, Share} from 'react-native';
import RNFS from 'react-native-fs';
export default {
  saveFile: async (url) => {
    try {
      let result;
      if (Platform.OS === 'android') {
        console.warn(RNFS.ExternalStorageDirectoryPath);
        RNFS.downloadFile({
          fromUrl: url,
          toFile: `${RNFS.ExternalStorageDirectoryPath}/react-native.png`
        });
      } else if (Platform.OS === 'ios') {

      } else {
        result = await NativeModules.ImageBaseModule.saveImageFile(url);
      }
      return result;
    } catch (e) {
      console.warn(e);
    }
  },
  copyFile: async (url) => {
    try {
      let result = await NativeModules.ImageBaseModule.saveToLocalFile(url);
      if (result) {
        Clipboard.setString(result);
      }
      return result;
    } catch (e) {
      console.warn(e);
    }
  },
  copyUrl: (url) => {
    try {
      Clipboard.setString(url);
    } catch (e) {
      console.warn(e);
    }
  },
  shareImage: async (url) => {
    try {
      let result = await NativeModules.ImageBaseModule.shareImage(url);
      return result;
    } catch (e) {
      console.warn(e);
    }
  },
  shareUrl: async (url) => {
    try {
      let result;
      if (Platform.OS === 'android') {
          Share.share({
            message: url,
            url: url,
          })

            .catch((error) => this.setState({result: 'error: ' + error.message}));
      } else if (Platform.OS === 'ios') {

      } else {
        result = await NativeModules.ImageBaseModule.shareUrl(url);
      }
      return result;
    } catch (e) {
      console.warn(e);
    }
  }
}