import React from 'react';
import Taro from "@tarojs/taro";
import {Image, View} from "@tarojs/components";
import { connect } from "react-redux";

import assets from '../../../assets';
import {StyleSheet} from "../../../utils";
import './index.global.scss';

const styles = StyleSheet.create({
  index: {
    position: "fixed",
    bottom: Taro.pxTransform(40),
    right: Taro.pxTransform(40),
    width: Taro.pxTransform(120),
    height: Taro.pxTransform(120),
    borderRadius: Taro.pxTransform(120),
    background: 'transparent',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: '0 6px 10px -2px rgba(0, 0, 0, 0.2), 0 12px 20px 0 rgba(0, 0, 0, 0.14), 0 2px 36px 0 rgba(0, 0, 0, 0.12)',
  },
  image: {
    width: Taro.pxTransform(54),
    height: Taro.pxTransform(54),
  }
})
const FloatButton = React.memo(({ themePrimary }) => {
  const navigateToSetting = () => Taro.navigateTo({ url: '/pages/setting/index' });
  return (
    <View
      className='rightBottom'
      style={{ ...styles.index, backgroundColor: themePrimary }}
      onClick={navigateToSetting}
    >
      <Image
        src={assets.images.iconSetting}
        style={styles.image}
      />
    </View>
  );
})

export default connect(({ global: { themePrimary } })=>({ themePrimary }))(FloatButton);
