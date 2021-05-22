import React, {CSSProperties} from 'react';
import Taro  from '@tarojs/taro';
import {Button, Image, Text, View} from "@tarojs/components";
import {connect} from "react-redux";

// 通过查阅微信 API ，我们分别通过 wx.getSystemInfoSync 及 wx.getMenuButtonBoundingClientRect 获取到 StatusBarHeight 及 MenuButton 的布局信息。
// NavigationBarPaddingTop = MenuButtonTop - StatusBarHeight
// NavigationBarPaddingBottom = NavigationBarPaddingTop
// NavigationBar = StatusBarHeight + NavigationBarPaddingTop + NavigationBarPaddingBottom + MenuButtonHeight
const systemInfo = Taro.getSystemInfoSync();

interface Props {
  global: any, style?: CSSProperties, children: any,title: any,renderLeftButton: any, onLeftButtonClick: any, isCustomLeftButton: any,
}

function NavigationBar(props: Props) {
  // { global, children, title,left }: { children?: any, title?: string | Component, left?: any, }
  const { global, style, children, title, onLeftButtonClick, isCustomLeftButton } = props;
  const { themePrimary } = global;
  const menuButtonBoundingClientRect = Taro.getMenuButtonBoundingClientRect();
  const navigationBarHeight = ((menuButtonBoundingClientRect.top - systemInfo.statusBarHeight) * 2) + menuButtonBoundingClientRect.height;
  let color = 'white';
  let backIconUrl = 'https://cdn.liuxuanping.com/arrow_back_white-24px.svg';
  if (style && (style.background >= '#999999' || style.backgroundColor >= '#999999')) {
    color = '#333333';
    backIconUrl = 'https://cdn.liuxuanping.com/arrow_back_black-24px.svg';
  }
  const navigationBarPxHeight = Taro.pxTransform(navigationBarHeight * 2);
  return (
    <View
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        backgroundColor: themePrimary,
        color,
        ...style,
      }}
    >
      <View
        style={{
          width: '100%',
          height: Taro.pxTransform(systemInfo.statusBarHeight * 2),
        }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: 'row',
        }}
      >
        <Button
          onClick={onLeftButtonClick || (Taro.getCurrentPages().length > 1 && (() => {
            Taro.navigateBack();
          }))}
        >
          <View
            style={{
              height: navigationBarPxHeight,
              width: navigationBarPxHeight,
              display: "flex",
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isCustomLeftButton ? (
              props.renderLeftButton
            ) : (Taro.getCurrentPages().length > 1 && (
              <Image
                style={{ color: '#000000', width:Taro.pxTransform(44), height: Taro.pxTransform(44)}}
                src={backIconUrl}
              />
            ))}
          </View>
        </Button>
        <View
          style={{
            flex: 1,
            marginLeft: Taro.pxTransform(32),
            height: navigationBarPxHeight,
            display: "flex",
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {title && ( typeof title === 'string' ? <Text style={{ fontWeight: "bold", fontSize: Taro.pxTransform(36) }}>{title}</Text> : title({ mode: (style && style.backgroundColor) >= '#999999' ? "light" : "dark" }))}
        </View>
        {/*<View*/}
        {/*  style={{*/}
        {/*    height: Taro.pxTransform(navigationBarHeight * 2),*/}
        {/*    display: "flex",*/}
        {/*    justifyContent: 'center',*/}
        {/*    alignItems: 'center',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {title && (<Text>{title}</Text>)}*/}
        {/*</View>*/}
      </View>
    </View>
  );
}
export default connect(({ global }) => ({ global }))(NavigationBar);


