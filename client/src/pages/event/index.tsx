import Taro, {Component, Config} from '@tarojs/taro'
import {Button, Image, Text, Textarea, View} from '@tarojs/components'
import {connect} from "@tarojs/redux";

import styles from './index.module.scss';
import {createAction} from "../../utils";
import images from '../../assets/images';
import application from "../../utils/Application";

const systemInfo = Taro.getSystemInfoSync();

const colorItemWidth = (systemInfo.screenWidth - (1 * 10)) / 10;

@connect(({ event, home }) => ({ event, home }))
export default class Index extends Component<any, any> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '记事',
    navigationBarBackgroundColor: '#1AAD19',
    navigationBarTextStyle: 'white',
  }

  constructor() {
    super(...arguments);
    const { home } = arguments[0];
    const { eventMap } = home;
    const { params: { date }} = this.$router;
    const state = {
      lastEditedAt: new Date(),
      _text: "",
      selectedBackground: application.setting.noteBackgroundColor,
    };
    if (eventMap[date]) {
      state['lastEditedAt'] = new Date(eventMap[date]['update_time'] * 1000);
      state['_text'] = eventMap[date].content;
    }
    this.state = state;
  }

  _fetch = () => {

  }

  _changeBackground = (selectedBackground) => {
    this.setState({
      selectedBackground,
    });
    application.setting.noteBackgroundColor = selectedBackground;
    Taro.setNavigationBarColor({
      backgroundColor: selectedBackground,
      frontColor: '#000000',
      animation: {
        timingFunc: "easeInOut",
        duration: 1,
      }
    });
  }

  _onTextChange = (event) => {
    this.setState({
      _text: event.detail.value,
    });
  }

  componentWillMount() {
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch(createAction('event/fetch')({
    //
    // }));
  }

  componentWillUnmount() {
    this._onPost();
  }

  componentDidShow() {
    const { params: { date }} = this.$router;
    const { home } = this.props;
    const { eventMap } = home;
    Taro.setNavigationBarTitle({
      title: `记事 | ${date}`,
    });
    if (eventMap[date]) {
      this._changeBackground(eventMap[date].background);
    } else {
      this._changeBackground(application.themes1[0].themePrimary);
    }
  }

  componentDidHide() {
  }

  _onPost = () => {
    const { params: { date }} = this.$router;
    const {_text, selectedBackground} = this.state;
    const { dispatch, home } = this.props;
    const { eventMap } = home;
    if (eventMap[date] && _text === (eventMap[date].content || '')) {
      return;
    }
    dispatch(createAction('event/post')({
      selectedDate: date,
      content: _text,
      background: selectedBackground,
    }));
  }

  render() {
    const { dispatch, event, home } = this.props;
    const { isMorePanelShowed, isAddPanelShowed } = event;
    const { eventMap } = home;
    const {_text, selectedBackground} = this.state;
    const { params: { date }} = this.$router;
    const eventDetail = eventMap[date];
    return (
      <View className={styles.index} style={{ backgroundColor: selectedBackground }}>
        {/*<View className={styles.eventRow}>*/}
        {/*  <Checkbox*/}
        {/*    checked*/}
        {/*    value='大姨妈来了'*/}
        {/*    onClick={this._onPost}*/}
        {/*  />*/}
        {/*  <Text className={styles.text}>大姨妈来了</Text>*/}
        {/*</View>*/}
        <Textarea
          style={{
            fontSize: Taro.pxTransform(32),
            padding: Taro.pxTransform(32),
            boxSizing: 'border-box',
            lineHeight: 1.5,
            width: '100%',
            height: '100%',
          }}
          onFocus={() => {
            dispatch(createAction('event/save')({ isMorePanelShowed: false, isAddPanelShowed: false, }))
          }}
          maxlength={-1}
          // count={false}
          // onChange={this._onTextChange}
          value={_text}
          // autoHeight
          autoFocus
          focus
          onInput={(event) => {
            this.setState({ _text: event.detail.value }, () => {
              if (event['update_time'] <= (Math.round(Date.now()/1000) - 60)) {
                this._onPost()
              }
            });
          }}
          // height={Taro.pxTransform(height)}
          onLineChange={this._onPost}
        />
        {isAddPanelShowed && (
          <View
            style={{ boxShadow: '0px -1px 3px 0px rgba(0,0,0,0.14)' }}
            onClick={() => dispatch(createAction('event/save')({ isAddPanelShowed: false }))}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingLeft: Taro.pxTransform(32),
                paddingRight: Taro.pxTransform(32),
                // backgroundColor: 'white',
                paddingTop: Taro.pxTransform(32),
                paddingBottom: Taro.pxTransform(32),
              }}
              onClick={() => Taro.showToast({ icon: "none", title: 'coming soon～' })}
            >
              <Text><Text style={{ fontSize: Taro.pxTransform(64) }}>☑</Text> 添加待办</Text>
            </View>
          </View>
        )}
        {isMorePanelShowed && (
          <View style={{ boxShadow: '0px -1px 3px 0px rgba(0,0,0,0.14)' }} >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingLeft: Taro.pxTransform(8),
                paddingRight: Taro.pxTransform(8),
                // backgroundColor: 'white',
                paddingTop: Taro.pxTransform(8),
                paddingBottom: Taro.pxTransform(8),
              }}
            >
              {application.themes1.map((item) => (
                <View
                  key={item.themePrimary} onClick={() => { this._changeBackground(item.themePrimary) }}
                  style={{
                    width: "10%",
                    padding: Taro.pxTransform(4),
                    // borderRadius: Taro.pxTransform(colorItemWidth * 2),
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
                      color: "black",
                      borderRadius: Taro.pxTransform(colorItemWidth * 2),
                      justifyContent: "center",
                      alignItems: "center",
                      boxSizing: "border-box",
                      backgroundColor: item.themePrimary,
                      border: item.themePrimary.toLowerCase() === '#ffffff' ? "#eeeeee 1px solid" : "none",
                    }}
                  >
                    <Text>{item.themePrimary === selectedBackground ? '✓' : ''}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        <View
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          onClick={() => {

          }}
        >
          <Button
            style={{ boxSizing: 'border-box', lineHeight: 1, }}
            onClick={() => {
              dispatch(createAction('event/save')({
                isAddPanelShowed: true,
              }));
            }}
          >
            <Image
              src={images.iconAdd}
              style={{
                lineHeight: 1,
                margin: Taro.pxTransform(16),
                width: Taro.pxTransform(48),
                height: Taro.pxTransform(48),
              }}
            />
          </Button>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: Taro.pxTransform(24),
              color: 'grey',
            }}
          >最后编辑时间: {eventDetail ? (new Date(eventDetail['update_time'] * 1000)).toLocaleString() : (new Date().toLocaleString())}</Text>
          <Button
            style={{ lineHeight: 1, }}
            onClick={() => {
              dispatch(createAction('event/save')({
                isMorePanelShowed: !isMorePanelShowed,
              }));
            }}
          >
            <Image
              src={images.iconMoreVertical}
              style={{
                lineHeight: 1,
                margin: Taro.pxTransform(16),
                width: Taro.pxTransform(48),
                height: Taro.pxTransform(48),
              }}
            />
          </Button>
        </View>
      </View>
    )
  }
}
