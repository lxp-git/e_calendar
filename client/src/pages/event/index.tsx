import Taro, {Component, Config} from '@tarojs/taro'
import {Checkbox, Text, Textarea, View} from '@tarojs/components'
import styles from './index.module.scss';
import {createAction} from "../../utils";

const systemInfo = Taro.getSystemInfoSync();
export default class Index extends Component<{
  dispatch: any,
}> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '编辑',
    navigationBarBackgroundColor: '#1AAD19',
    navigationBarTextStyle: 'white',
  }

  state = {
    _text: "",
  }

  _fetch = () => {

  }

  _onTextChange = (event) => {
    this.setState({
      _text: event.detail.value,
    });
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(createAction('event/fetch')({

    }));
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  _onPost = () => {
    const { dispatch } = this.props;
    dispatch(createAction('event/post')());
  }

  render() {
    const {_text} = this.state;
    /// 标题栏高度：安卓：48px，iOS：44px  - systemInfo.statusBarHeight - (systemInfo.platform === 'ios' ? 44 : 48)
    const height = (systemInfo.windowHeight) * systemInfo.pixelRatio;
    console.log('Taro.pxTransform(height)', Taro.pxTransform(height));
    return (
      <View className={styles.index}>
        <View className={styles.eventRow}>
          <Checkbox
            checked
            value='大姨妈来了'
            onClick={this._onPost}
          />
          <Text className={styles.text}>大姨妈来了</Text>
        </View>
        <Textarea
          className={styles.inputArea}
          maxlength={-1}
          // count={false}
          // onChange={this._onTextChange}
          value={_text}
          autoHeight
          onInput={(event) => this.setState({ _text: event.detail.value })}
          // height={Taro.pxTransform(height)}
        />
      </View>
    )
  }
}
