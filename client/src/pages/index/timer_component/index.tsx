import Taro, { Component } from '@tarojs/taro';
import {Text, Button} from '@tarojs/components';
import moment from "moment";
import {ITouchEvent} from "@tarojs/components/types/common";

interface State {
  _nowLocaleString: string,
}

interface Props {
  onClick?: (event: ITouchEvent) => any,
}

export default class TimerComponent extends Component<Props, State> {

  state = {
    _nowLocaleString: moment().format('YYYY/MM/DD HH:mm:ss'),
  }

  timer;

  componentWillMount () { }

  componentDidMount () {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.setState({
        _nowLocaleString: moment().format('YYYY/MM/DD HH:mm:ss'),
      });
    }, 1000);
  }

  componentWillUnmount () {
    clearInterval(this.timer);
  }

  componentDidShow () {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.setState({
        _nowLocaleString: moment().format('YYYY/MM/DD HH:mm:ss'),
      });
    }, 1000);
  }

  componentDidHide () {
    clearInterval(this.timer);
  }

  render () {
    const { onClick } = this.props;
    const { _nowLocaleString } = this.state;
    return (
      <Button
        onLongPress={() => {
          Taro.navigateTo({
            url: '/pages/clock/index',
          });
        }}
        onLongClick={() => {
          Taro.navigateTo({
            url: '/pages/clock/index',
          });
        }}
        onClick={onClick} style={{ backgroundColor: '#ffffff' }}
      >
        <Text
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: Taro.pxTransform(32),
            paddingRight: Taro.pxTransform(32),
            paddingTop: Taro.pxTransform(32),
            paddingBottom: Taro.pxTransform(32),
            margin: 0,
            backgroundColor: 'white',
            fontSize: Taro.pxTransform(32),
            color: "#444444",
            borderRadius: 0,
          }}
        >{_nowLocaleString}</Text>
      </Button>
    )
  }
}
