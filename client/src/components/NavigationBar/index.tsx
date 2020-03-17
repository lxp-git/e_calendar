import Taro, { Component } from '@tarojs/taro';
import {Button, Image, Text, View} from "@tarojs/components";
import {connect} from "@tarojs/redux";

// 通过查阅微信 API ，我们分别通过 wx.getSystemInfoSync 及 wx.getMenuButtonBoundingClientRect 获取到 StatusBarHeight 及 MenuButton 的布局信息。
// NavigationBarPaddingTop = MenuButtonTop - StatusBarHeight
// NavigationBarPaddingBottom = NavigationBarPaddingTop
// NavigationBar = StatusBarHeight + NavigationBarPaddingTop + NavigationBarPaddingBottom + MenuButtonHeight
const systemInfo = Taro.getSystemInfoSync();

interface Props {
  global: any, style: object, children: any,title: any,renderLeftButton: any, onLeftButtonClick: any, isCustomLeftButton: any,
}

function NavigationBar(props: Props) {
  // { global, children, title,left }: { children?: any, title?: string | Component, left?: any, }
  const { global, style, children, title, onLeftButtonClick, isCustomLeftButton } = props;
  const { themePrimary } = global;
  const menuButtonBoundingClientRect = Taro.getMenuButtonBoundingClientRect();
  const navigationBarHeight = (menuButtonBoundingClientRect.top - systemInfo.statusBarHeight) * 2 + menuButtonBoundingClientRect.height;
  return (
    <View
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        ...style,
      }}
    >
      <View
        style={{
          backgroundColor: themePrimary,
          width: '100%',
          height: Taro.pxTransform(systemInfo.statusBarHeight * 2),
        }}
      />
      <View
        style={{
          backgroundColor: themePrimary,
          display: "flex",
          flexDirection: 'row',
          color: 'white',
        }}
      >
        <Button
          onClick={onLeftButtonClick || (Taro.getCurrentPages().length > 1 && (() => {
            Taro.navigateBack();
          }))}
          style={{ background: themePrimary }}
        >
          <View
            style={{
              height: Taro.pxTransform(navigationBarHeight * 2),
              width: Taro.pxTransform(navigationBarHeight * 2),
              display: "flex",
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isCustomLeftButton ? (
              this.props.renderLeftButton
            ) : (Taro.getCurrentPages().length > 1 && (
              <Image
                style={{width:Taro.pxTransform(44), height: Taro.pxTransform(44)}}
                src='https://cdn.liuxuanping.com/arrow_back_white-24px.svg'
              />
            ))}
          </View>
        </Button>
        <View
          style={{
            flex: 1,
            marginLeft: Taro.pxTransform(32),
            height: Taro.pxTransform(navigationBarHeight * 2),
            display: "flex",
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {title && (<Text>{title}</Text>)}
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


