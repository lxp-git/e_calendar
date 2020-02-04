import Taro, { Component } from '@tarojs/taro'
import {View, Button} from '@tarojs/components'
import styles from './index.module.scss';

import moment from "moment";

export default class TimerComponent extends Component {

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
      <Button onLongPress={(event) => {
        Taro.navigateTo({
          url: '/pages/clock/index',
        });
      }} onClick={onClick} style={{ background: 'white' }}>
        <View className={styles.index}>{_nowLocaleString}</View>
      </Button>
    )
  }
}
