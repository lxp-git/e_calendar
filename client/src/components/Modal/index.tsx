import { View } from "@tarojs/components";
import Taro from '@tarojs/taro';

export default function Modal({ children, isOpened }) {
  return isOpened ? (
    <View
      style={{
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0,
        opacity: 0.7,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
    >
      {children}
    </View>
  ) : (<View />);
}
