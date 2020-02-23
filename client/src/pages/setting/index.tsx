import Taro, {Component, Config} from '@tarojs/taro'
import {Button, Text, View} from '@tarojs/components'
import styles from './index.module.scss';
import {AtListItem, AtModal, AtModalContent} from "taro-ui";
import application from "../../utils/Application";
import {connect} from "@tarojs/redux";
import ThemePage from "../ThemePage";
const systemInfo = Taro.getSystemInfoSync();
const gridItemWidth = (systemInfo.screenWidth - 10) / 7;

@connect(({ global }) => ({ global }))
export default class Index extends ThemePage {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '一个日历 | 设置',
    navigationBarTextStyle: 'white',
  }

  state = {
    _isThemeModelOpened: false,
  }

  _fetch = () => {

  }

  _onThemeSelected = (color: string) => {
    application.setting.themePrimary = color;
    this.setState({
      _isThemeModelOpened: false,
    });
  }

  componentWillMount() {
  }

  componentDidMount() {
    this._fetch();
  }

  componentWillUnmount() {
  }

  render() {
    const { _isThemeModelOpened } = this.state;
    const { global: { themePrimary }} = this.props;
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
        <AtListItem
          title='切换主题色'
          note='可以更改全局的主色调'
          onClick={() => this.setState({_isThemeModelOpened: !this.state._isThemeModelOpened})}
        />
        <Button openType='getUserInfo' className={styles.customerService}>
          <AtListItem title='绑定用户信息' note='仅仅为了在合适的地方展示一个你的漂亮微信头像😝' />
        </Button>
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
        <AtModal isOpened={_isThemeModelOpened}>
          <AtModalContent>
            <View className={styles.themeModel}>
              {application.themes0.map((item) => (
                <View
                  key={item.themePrimary}
                  onClick={() => this._onThemeSelected(item.themePrimary)}
                  className={styles.themeItem}
                  style={{
                    background: item.themePrimary, width: gridItemWidth + 'px', height: gridItemWidth + 'px',
                    border: item.themePrimary.toLowerCase() === '#ffffff' ? "#eeeeee 1px solid" : "none",
                  }}
                >{item.themePrimary.toLowerCase() === themePrimary ? '✓' : ''}</View>
              ))}
            </View>
          </AtModalContent>
        </AtModal>
      </View>
    )
  }
}
