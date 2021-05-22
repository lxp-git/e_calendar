import React from 'react';
import {Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
// import {AtButton, AtIcon} from "taro-ui";

import styles from './index.module.scss';

function TranslationCard({ }: any) {
  return (
    <View className={styles.index}>
      <View className={styles.card} onClick={(event) => { event.preventDefault();event.stopPropagation(); Taro.navigateTo({ url: '/pages/words/index' }) }}>
        <Text className={styles.title}>Translations of <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: Taro.pxTransform(32) }}>command</Text></Text>
        <View className={styles.row} style={{ justifyContent: 'space-between' }}>
          <View style={{ color: '#4285f4' }}>Noun</View>
          <View className={styles.frequency}>Frequency</View>
        </View>
        <View className={styles.row}>
          <View className={styles.start}>命令</View>
          <View className={styles.longest} >command,order,mandate,dictate,behest,pragmatic</View>
          <View className={styles.end}>---</View>
        </View>
      </View>
    </View>
  );
}

export default TranslationCard;
