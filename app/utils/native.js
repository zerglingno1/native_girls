import { NativeModules, Clipboard } from 'react-native';

export default {
  saveFile: async (url) => {
    try {
      let result = await NativeModules.ImageBaseModule.saveImageFile(url);
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
      let result = await NativeModules.ImageBaseModule.shareUrl(url);
      return result;
    } catch (e) {
      console.warn(e);
    }
  }
}