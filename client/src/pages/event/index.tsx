import React, { Component } from 'react';
import Taro, {Config} from '@tarojs/taro'
import {Button, Editor, Image, RichText, Text, Textarea, View} from '@tarojs/components'
import {connect} from "react-redux";

import styles from './index.module.scss';
import {createAction} from "../../utils";
import images from '../../assets/images';
import application from "../../utils/Application";
import PageContainer from "../../components/PageContainer";

const systemInfo = Taro.getSystemInfoSync();

const colorItemWidth = (systemInfo.screenWidth - (1 * 10)) / 10;

@connect(({ event, home }) => ({ event, home }))
export default class Index extends Component<any, any> {

  constructor() {
    super(...arguments);
    const { home } = arguments[0];
    const { eventMap } = home;
    const { params: { date }} = Taro.getCurrentInstance().router;
    const state = {
      lastEditedAt: new Date(),
      _text: "",
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
    const { dispatch } = this.props;
    dispatch(createAction('event/save')({ currentBackground: selectedBackground }));
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
    // const { dispatch, home } = this.props;
    // const { eventMap } = home;
    // const { params: { date }} = Taro.getCurrentInstance().router;
    // if (eventMap[date]) {
    //   dispatch(createAction('event/save')({
    //     currentBackground: eventMap[date].background,
    //   }));
    // }
  }

  componentWillUnmount() {
    this._onPost();
  }

  componentDidShow() {
    const { params: { date }} = Taro.getCurrentInstance().router;
    const { home, event } = this.props;
    const { eventMap } = home;
    const { currentBackground } = event;
    Taro.setNavigationBarTitle({
      title: `记事 | ${date}`,
    });
    if (eventMap[date]) {
      this._changeBackground(eventMap[date].background);
    } else {
      this._changeBackground(currentBackground);
    }
  }

  componentDidHide() {
  }

  _onPost = () => {
    const { params: { date }} = Taro.getCurrentInstance().router;
    const {_text} = this.state;
    const { dispatch, home, event } = this.props;
    const { eventMap } = home;
    const { currentBackground } = event;
    if (eventMap[date] && _text === (eventMap[date].content || '') && eventMap[date].background === currentBackground) {
      return;
    }
    if (!eventMap[date] && _text === '') {
      return;
    }
    dispatch(createAction('event/post')({
      selectedDate: date,
      content: _text,
    }));
  }

  render() {
    const { dispatch, event, home } = this.props;
    const { isMorePanelShowed, isAddPanelShowed, currentBackground } = event;
    console.log("isMorePanelShowed", isMorePanelShowed);
    const { eventMap } = home;
    const {_text} = this.state;
    const { params: { date }} = Taro.getCurrentInstance().router;
    const eventDetail = eventMap[date];
    const lastEditedDate = eventDetail ? (new Date(eventDetail['update_time'] * 1000)) : (new Date());
    const lastEditedAt = `${lastEditedDate.getFullYear()}-${(lastEditedDate.getMonth() + 1) >= 10 ? (lastEditedDate.getMonth() + 1) : ('0'+(lastEditedDate.getMonth()+1))}-${lastEditedDate.getDate()} ${lastEditedDate.getHours()}:${lastEditedDate.getMinutes() >= 10 ? lastEditedDate.getMinutes() : '0' + lastEditedDate.getMinutes()}:${lastEditedDate.getSeconds() >= 10 ? lastEditedDate.getSeconds() : '0' + lastEditedDate.getSeconds()}`;
    return (
      <PageContainer
        navigationBarStyle={{ backgroundColor: currentBackground }}
        style={{ backgroundColor: currentBackground }}
        title={`记事 | ${date}`}
      >
        {/*<View className={styles.eventRow}>*/}
        {/*  <Checkbox*/}
        {/*    checked*/}
        {/*    value='大姨妈来了'*/}
        {/*    onClick={this._onPost}*/}
        {/*  />*/}
        {/*  <Text className={styles.text}>大姨妈来了</Text>*/}
        {/*</View>*/}
        {/*<Editor />*/}
        {/*<RichText nodes={`<h4>我是大标题</h4>`} space={''} />*/}
        <Textarea
          style={{
            fontSize: Taro.pxTransform(32),
            padding: Taro.pxTransform(32),
            boxSizing: 'border-box',
            lineHeight: 1.5,
            flex: 1,
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
          // focus
          adjustPosition={false}
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
                    width: Taro.pxTransform(colorItemWidth * 2),
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
                      borderRadius: '100%',
                      // borderRadius: Taro.pxTransform(colorItemWidth * 2),
                      justifyContent: "center",
                      alignItems: "center",
                      boxSizing: "border-box",
                      backgroundColor: item.themePrimary,
                      border: item.themePrimary.toLowerCase() === '#ffffff' ? "#eeeeee 1px solid" : "none",
                    }}
                  >
                    <Text>{item.themePrimary === currentBackground ? '✓' : ''}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          className={styles.safeBottom}
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
          >最后编辑时间: {lastEditedAt}</Text>
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
      </PageContainer>
    )
  }
}
