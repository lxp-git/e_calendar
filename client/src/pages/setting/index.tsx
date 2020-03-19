import Taro, {Config} from '@tarojs/taro'
import {Button, Image, Text, View} from '@tarojs/components'

import {connect} from "@tarojs/redux";
import application from "../../utils/Application";
import ThemePage from "../ThemePage";
import {createAction} from "../../utils";
import ListItem from '../../components/ListItem';
import Modal from '../../components/Modal';
import TaroButton from "../../components/TaroButton";
import PageContainer from '../../components/PageContainer';
import styles from './index.module.scss';

const colorItemWidth = (Taro.getSystemInfoSync().screenWidth - 100) / 4;

@connect(({ global, setting }) => ({ global, setting }))
class Index extends ThemePage {

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

  _fetch = () => {

  }

  _onThemeSelected = (color: string) => {
    const { dispatch } = this.props;
    application.setting.themePrimary = color;
    dispatch(createAction('setting/save')({
      isThemeModelOpened: false,
    }));
    if (Taro.getEnv() === Taro.ENV_TYPE.RN) {
      Taro.showToast({
        title: 'App需要重启完全应用主题',
        icon: 'success',
      });
      // Taro.showModal({
      //   title: '是否重启App？',
      //   content: 'App需要重启完全应用主题',
      //   success: (event) => {
      //     Taro.reLaunch({
      //       url: '/pages/index/index',
      //     });
      //   },
      // });
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    this._fetch();
  }

  componentWillUnmount() {
  }

  _fetchWords = () => {
    const { dispatch } = this.props;
    dispatch(createAction('words/fetch')({}));
  }

  _fetchEvents = () => {
    const { dispatch } = this.props;
    dispatch(createAction('home/fetchEvent')({}));
  }

  _login = (callback) => {
    const { dispatch } = this.props;
    dispatch(createAction('home/login')({
      callback: callback,
    }));
  }

  render() {
    const { global: { themePrimary }, dispatch, setting = {} } = this.props;
    const { isThemeModelOpened = false, isContactModalOpened = false } = setting;
    return (
      <PageContainer
        style={{
          display: "flex",
          width: "100%",
          minHeight: "100%",
          flexDirection: "column",
          backgroundColor: "#f4f4f4",
        }}
        title={this.config.navigationBarTitleText}
      >
        <ListItem
          title='大姨妈'
          isSwitch
          switchIsCheck={application.setting.isAuntFloEnabled}
          onSwitchChange={(event) => {
            application.setting.isAuntFloEnabled = event.detail.value;
            this._fetchEvents();
          }}
          onClick={(event) => {
            console.log('onClick', "大姨妈");
          }}
          note='开启之后，长按选择日历的某一天可以标记'
        />
        <ListItem
          title='记事本'
          isSwitch
          switchIsCheck={application.setting.isNoteBookEnabled}
          onSwitchChange={(event) => {
            application.setting.isNoteBookEnabled = event.detail.value;
            this._fetchWords();
          }}
          onClick={(event) => {
            console.log('onClick', "记事本");
          }}
          note='开启之后，点击当日的详细可以记事'
        />
        <ListItem
          title='单词本'
          isSwitch
          switchIsCheck={application.setting.isReviewWordsEnabled}
          onSwitchChange={(event) => {
            application.setting.isReviewWordsEnabled = event.detail.value;
          }}
          onClick={(event) => {
            console.log('onClick', "单词本");
          }}
          note='开启之后，首页会显示一个您查过的单词'
        />
        <ListItem
          arrow='right'
          title='切换主题色'
          note='可以更改全局的主色调'
          onClick={() => dispatch(createAction('setting/save')({ isThemeModelOpened: true }))}
        />
        {Taro.getEnv() === Taro.ENV_TYPE.WEAPP && <TaroButton
          openType='getUserInfo'
          style={{
            position: 'relative',
            width: "100%",
            textAlign: "start",
            backgroundColor: "white",
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
            marginTop: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
          }}
          onGetUserInfo={({ detail: { userInfo }}) => {
            // const { avatarUrl, city, country, gender, nickName, province } = userInfo;
            if (userInfo) {
              dispatch(createAction('user/put')(userInfo));
            }
          }}
          onClick={() => {
            console.log('绑定用户信息');
          }}
        >
          <ListItem arrow='right' title='绑定用户信息' note='仅仅在合适的地方展示一个你的漂亮微信头像😝' />
        </TaroButton>}
        <Button
          style={{
            width: "100%",
            textAlign: "start",
            backgroundColor: "white",
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
            marginTop: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
          }}
          onClick={(data) => {
            if (Taro.getEnv() === Taro.ENV_TYPE.RN) {
              dispatch(createAction('setting/save')({ isContactModalOpened: true }));
            }
          }}
          openType='contact'
        >
          <ListItem arrow='right' title='联系我们' note='有什么问题或者建议都可以联系我们🥳' />
        </Button>
        <View
          style={{
            marginTop: Taro.pxTransform(32),
            marginLeft: Taro.pxTransform(32),
            marginRight: Taro.pxTransform(32),
            color: '#333333',
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text style={{}}>简易说明</Text>
          <Text style={{ fontSize: Taro.pxTransform(24), whiteSpace: 'pre' }}>
            {`1.  程序所有数据均保存在微信云开发服务器，不用作其他用途\n` +
          `2. 点击日历右上角的时间：日历回到本月并选中今天\n` +
          `3. 长按日历右上角的时间：床头钟\n` +
          `4. 左/右滑动日历：切换上一个/下一个月\n` +
            `5. 床头钟模式如何返回：点右上角三个点然后选择回到首页\n`}</Text>
        </View>
        <Modal isOpened={isContactModalOpened}>
          <View
            className={styles.animalMask}
            onClick={() => { dispatch(createAction('setting/save')({ isContactModalOpened: false })) }}
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center", }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: 'transparent',
                opacity: 1,
              }}
            >
              <Image
                src='https://cdn.liuxuanping.com/gh_08eeaa873774_344.jpg'
                style={{ width: Taro.pxTransform(400), height: Taro.pxTransform(400) }}
              />
              <Text style={{ marginTop: Taro.pxTransform(20), color: 'white' }}>用微信扫描上方的二维码</Text>
            </View>
          </View>
        </Modal>
        <Modal isOpened={isThemeModelOpened}>
          <View
            className={styles.animalMask}
            onClick={() => { dispatch(createAction('setting/save')({ isThemeModelOpened: false })) }}
            style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.7)', flex: 1, width: "100%", height: "100%", justifyContent: "center",
              alignItems: "center", paddingLeft: Taro.pxTransform(100), paddingRight: Taro.pxTransform(100) }}
          >
            <View
              className={styles.modalContent}
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {application.themes0.map((item) => (
                <View
                  key={item.themePrimary} onClick={() => this._onThemeSelected(item.themePrimary)}
                  style={{
                    width: "25%",
                    padding: Taro.pxTransform(8),
                    boxSizing: 'border-box',
                    height: Taro.pxTransform(colorItemWidth * 2),
                    display: 'flex',
                    opacity: 1,
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      opacity: 1,
                      flex: 1,
                      color: "white",
                      justifyContent: "center",
                      alignItems: "center",
                      boxSizing: "border-box",
                      backgroundColor: item.themePrimary,
                      border: item.themePrimary.toLowerCase() === '#ffffff' ? "#eeeeee 1px solid" : "none",
                    }}
                  >
                    <Text>{item.themePrimary.toLowerCase() === themePrimary ? '✓' : ''}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Modal>
      </PageContainer>
    )
  }
}
Index.navigationOptions =  ({ navigation }) => {
  return ({
    title: 'Home',
    headerStyle: {
      backgroundColor: application.setting.themePrimary,
      elevation: 0,
    },
    headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    //   color: '#000',
    // },
  });
}
Index.config = {
  navigationBarTitleText: '一个日历 | 设置',
  navigationBarTextStyle: 'white',
}
export default Index;
