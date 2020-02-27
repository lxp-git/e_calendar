import Taro, { Component } from '@tarojs/taro';
import {View, Button} from '@tarojs/components';
import moment from "moment";
import {ITouchEvent} from "@tarojs/components/types/common";

import styles from './index.module.scss';

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

  }

  componentWillUnmount () {
    clearInterval(this.timer);
  }

  componentDidShow () {
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
        onClick={onClick} style={{ background: 'white' }}
      >
        <View className={styles.index}>{_nowLocaleString}</View>
      </Button>
    )
  }
}
