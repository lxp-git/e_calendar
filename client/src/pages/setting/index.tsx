import Taro, {Component, Config} from '@tarojs/taro'
import {Button, Text, View} from '@tarojs/components'
import styles from './index.module.scss';
import {AtListItem, AtModal, AtModalContent} from "taro-ui";
import application from "../../utils/Application";
const systemInfo = Taro.getSystemInfoSync();
const gridItemWidth = (systemInfo.screenWidth - 10) / 7;
export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '一个日历 | 设置',
    navigationBarBackgroundColor: '#1AAD19',
    navigationBarTextStyle: 'white',
  }

  state = {
    _open: false,
  }

  _fetch = () => {

  }

  _onThemeSelected = (color: string) => {
    application.setting.themePrimary = color;
  }

  componentWillMount() {
  }

  componentDidMount() {
    this._fetch();
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    return (
      <View className={styles.index}>
        <AtListItem
          title='大姨妈'
          isSwitch
          switchIsCheck={application.setting.isAuntFloEnabled}
          onSwitchChange={(event) => {
            application.setting.isAuntFloEnabled = event.detail.value;
          }}
          onClick={(event) => {
            console.log('onClick', event);
          }}
          switchColor='#07C160'
          note='开启之后，长按选择日历的某一天可以标记'
        />
        {/*<AtListItem title='切换主题色' note='可以更改全局的主色调' onClick={() => this.setState({is})} />*/}
        <Button openType='contact' className={styles.customerService}>
          <AtListItem title='联系我们' note='有什么问题或者建议都可以联系我们🥳' />
        </Button>
        <View className={styles.guidelines}>
          <Text className={styles.title}>简易说明</Text>
          <Text className={styles.body}>
            {`1. 程序所有数据均保存在微信云开发服务器，不用作其他用途\n` +
          `2. 点击日历右上角的时间：日历回到本月并选中今天\n` +
          `3. 长按日历右上角的时间：床头钟\n` +
          `4. 左/右滑动日历：切换上一个/下一个月\n` +
            `5. 床头钟模式如何返回：点右上角三个点然后选择回到首页\n`}</Text>
        </View>
        {/*<AtModal isOpened>*/}
        {/*  <AtModalContent>*/}
        {/*    <View className={styles.themeModel}>*/}
        {/*      {['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',*/}
        {/*        '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',*/}
        {/*        '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#000000'].map((item) => (*/}
        {/*        <View*/}
        {/*          onClick={() => this._onThemeSelected(item)}*/}
        {/*          className={styles.themeItem}*/}
        {/*          style={{ background: item, width: gridItemWidth + 'px', height: gridItemWidth + 'px' }}*/}
        {/*        />*/}
        {/*      ))}*/}
        {/*    </View>*/}
        {/*  </AtModalContent>*/}
        {/*</AtModal>*/}
      </View>
    )
  }
}
