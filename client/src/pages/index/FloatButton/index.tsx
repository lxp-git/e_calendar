import React from 'react';
import Taro from "@tarojs/taro";
import {Image, View} from "@tarojs/components";
import { connect } from "react-redux";

import styles from "./index.module.scss";

function FloatButton (props: { global: any }) {
  return (
    <View
      style={{
        position: "fixed",
        bottom: Taro.pxTransform(40),
        right: Taro.pxTransform(40),
        //animation: animal 20s infinite linear ;
        // backgroundColor: 'transparent',
        width: Taro.pxTransform(120),
        height: Taro.pxTransform(120),
        borderRadius: Taro.pxTransform(120),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        //box-shadow: 0 6px 10px -2px rgba(0, 0, 0, 0.2), 0 12px 20px 0 rgba(0, 0, 0, 0.14), 0 2px 36px 0 rgba(0, 0, 0, 0.12);
        backgroundColor: props && props.global && props.global.themePrimary || "#07C160" }}
      className={styles.rightBottom}
      onClick={() => Taro.navigateTo({ url: '/pages/setting/index' })}
    >
      <Image
        src='https://cdn.liuxuanping.com/baseline_settings_white_18dp.png'
        // source={{ uri: 'https://cdn.liuxuanping.com/baseline_settings_black_18dp.png' }}
        style={{
          width: Taro.pxTransform(54),
          height: Taro.pxTransform(54),
          // tintColor: 'white',
        }}
      />
    </View>
  );
}

export default connect(({ global })=>({ global }))(FloatButton);
