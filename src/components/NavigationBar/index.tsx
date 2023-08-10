import React, { CSSProperties } from 'react';
import Taro from '@tarojs/taro';
import { Button, Image, Text, View } from "@tarojs/components";
import assets from '../../assets';
import { useAppSelector } from '../../dva';

const systemInfo = Taro.getSystemInfoSync();
console.log("systemInfo", systemInfo)

interface Props {
  style?: CSSProperties, title: any, renderLeftButton: any, onLeftButtonClick: () => void, isCustomLeftButton: any,
}

export default React.memo((props: Props) => {
  const { style, title, onLeftButtonClick, isCustomLeftButton } = props;
  const themePrimary = useAppSelector(state => state.global.themePrimary);

  let color = 'white';
  let backIconUrl = assets.images.iconArrowBackWhite;
  if (style && ((style?.background && style?.background >= '#999999') || (style?.backgroundColor && style?.backgroundColor >= '#999999'))) {
    color = '#333333';
    backIconUrl = assets.images.iconArrowBackBlack;
  }
  const statusBarHeight = systemInfo.statusBarHeight || 0;
  const rect = Taro.getMenuButtonBoundingClientRect();
  const navigationBarHeight = (rect.top - statusBarHeight) * 2 + rect.height;// 38;
  return (
    <View
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        backgroundColor: themePrimary,
        color,
        borderWidth: 10,
        height: statusBarHeight + navigationBarHeight,
        ...style,
      }}
    >
      <View
        style={{
          width: '100%',
          height: systemInfo.statusBarHeight,
        }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: 'row',
          height: navigationBarHeight,
        }}
      >
        <Button
          onClick={onLeftButtonClick || (Taro.getCurrentPages().length > 1 && (() => {
            Taro.navigateBack();
          }))}
        >
          <View
            style={{
              height: navigationBarHeight,
              width: navigationBarHeight,
              display: "flex",
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isCustomLeftButton ? (
              props.renderLeftButton
            ) : (Taro.getCurrentPages().length > 1 && (
              <Image
                style={{ color: '#000000', width: Taro.pxTransform(44), height: Taro.pxTransform(44) }}
                src={backIconUrl}
              />
            ))}
          </View>
        </Button>
        <View
          style={{
            flex: 1,
            marginLeft: Taro.pxTransform(32),
            height: navigationBarHeight,
            display: "flex",
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {title && (typeof title === 'string' ? <Text style={{ fontWeight: "bold", fontSize: Taro.pxTransform(36) }}>{title}</Text> : title({ mode: (style && style.backgroundColor && style.backgroundColor >= '#999999') ? "light" : "dark" }))}
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
})
