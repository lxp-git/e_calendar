import React, {CSSProperties, ReactNode} from 'react';
import {View} from "@tarojs/components";
import NavigationBar from "../NavigationBar";
import Taro from "@tarojs/taro";

function PageContainer({ children, style, title, isCustomLeftButton = false, renderLeftButton, onLeftButtonClick, navigationBarStyle, enableFlex = true }: {
  enableFlex?: boolean, children: any, style?: CSSProperties, title?: string | ReactNode, isCustomLeftButton?: boolean, renderLeftButton?: React.ReactElement, onLeftButtonClick?: () => void, navigationBarStyle?: object,
}) {
  if (!enableFlex) {
    if (!navigationBarStyle) {
      navigationBarStyle = {};
    }
    navigationBarStyle["position"] = "absolute";
    navigationBarStyle["left"] = 0;
    navigationBarStyle["right"] = 0;
    navigationBarStyle["top"] = 0;
  }
  const systemInfo = Taro.getSystemInfoSync();
  const menuButtonBoundingClientRect = Taro.getMenuButtonBoundingClientRect();
  const navigationBarHeight = ((menuButtonBoundingClientRect.top - systemInfo.statusBarHeight) * systemInfo.pixelRatio) + menuButtonBoundingClientRect.height;
  const headerHeight = Taro.pxTransform((navigationBarHeight + systemInfo.statusBarHeight) * systemInfo.pixelRatio)
  return (
    <View
      style={enableFlex ? {
        display: 'flex',
        minHeight: '100%',
        width: '100%',
        flexDirection: "column",
        backgroundColor: '#f4f4f4',
        ...style,
      } : {
        overflow: "hidden",
      }}
    >
      <NavigationBar
        title={title}
        isCustomLeftButton={isCustomLeftButton}
        renderLeftButton={
          <View>
            {renderLeftButton}
          </View>
        }
        style={navigationBarStyle}
        onLeftButtonClick={onLeftButtonClick}
      />
      <View style={enableFlex ? { display: 'flex', flex: 1, flexDirection: "column", height: 0 } : { marginTop: headerHeight, overflow: "hidden" }}>
        {children}
      </View>
    </View>
  );
}

export default PageContainer;
