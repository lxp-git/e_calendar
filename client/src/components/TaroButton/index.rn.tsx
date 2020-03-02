import Taro from '@tarojs/taro';
import {TouchableOpacity} from "react-native";

function TaroButton(props) {
  return (
    <TouchableOpacity onPress={props.onClick} {...props} />
  );
}

export default TaroButton;
