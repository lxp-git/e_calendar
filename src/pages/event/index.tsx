import React from 'react';
import Taro from '@tarojs/taro'
import {Button, Image, Text, Textarea, View} from '@tarojs/components'
import {connect} from "react-redux";

import {createAction, StyleSheet} from "../../utils";
import images from '../../assets/images';
import application from "../../utils/Application";
import PageContainer from "../../components/PageContainer";
import './index.global.scss';

const systemInfo = Taro.getSystemInfoSync();

const colorItemWidth = (systemInfo.screenWidth - (1 * 10)) / 10;

const styles = StyleSheet.create({
  textarea: {
    fontSize: Taro.pxTransform(32),
    padding: Taro.pxTransform(32),
    boxSizing: 'border-box',
    lineHeight: 1.5,
    flex: 1,
    width: '100%',
    height: '100%',
  }
})


const Index = connect(({ event: { isMorePanelShowed, isAddPanelShowed, currentBackground }, home: { eventMap } }) => ({ isMorePanelShowed, isAddPanelShowed, currentBackground, eventMap }))(React.memo((props) => {

  const { dispatch, isMorePanelShowed, isAddPanelShowed, currentBackground, eventMap } = props;
  console.log("isMorePanelShowed", isMorePanelShowed);
  const { params: { date }} = Taro.useRouter();
  // const [content, setContent] = React.useState();
  const that = React.useRef({ content: eventMap?.date?.content });

  const _fetch = () => {

  }

  const _changeBackground = (selectedBackground) => {
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

  const _onInput = (event) => {
    that.current.content = event.detail.value;
    if (event['update_time'] <= (Math.round(Date.now()/1000) - 60)) {
      _onPost()
    }
  }

  const _onPost = () => {
    if (eventMap[date] && that.current.content === (eventMap[date].content || '') && eventMap[date].background === currentBackground) {
      return;
    }
    if (!eventMap[date] && that.current.content === '') {
      return;
    }
    dispatch(createAction('event/post')({
      selectedDate: date,
      content: that.current.content,
    }));
  }

    React.useEffect(() => {
      const init = () => {
        Taro.setNavigationBarTitle({
          title: `记事 | ${date}`,
        });
        if (eventMap[date]) {
          _changeBackground(eventMap[date].background);
        } else {
          _changeBackground(currentBackground);
        }
      }
      init();
    }, [ date, eventMap, currentBackground ])
  React.useEffect(() => {
    return () => {
      _onPost();
    }
  }, [])

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
        style={styles.textarea}
        onFocus={() => {
          dispatch(createAction('event/save')({ isMorePanelShowed: false, isAddPanelShowed: false, }))
        }}
        maxlength={-1}
        // count={false}
        // onChange={this._onTextChange}
        value={that.current.content}
        // autoHeight
        autoFocus
        // focus
        adjustPosition={false}
        onInput={_onInput}
        // height={Taro.pxTransform(height)}
        onLineChange={_onPost}
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
                key={item.themePrimary} onClick={() => { _changeBackground(item.themePrimary) }}
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
        className='safeBottom'
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
  );
}));

export default Index;
