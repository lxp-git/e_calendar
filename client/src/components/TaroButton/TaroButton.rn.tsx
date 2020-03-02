import Taro from '@tarojs/taro';
import {TouchableOpacity} from "react-native";

export default function TaroButton(props) {
  return (
    <TouchableOpacity onPress={props.onClick} {...props} />
  );
}
