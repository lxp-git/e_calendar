import React from 'react';
import {Image, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
// import {AtButton, AtIcon} from "taro-ui";

import styles from './index.module.scss';

function ExampleCard({ wordCard = {} }: any) {
  const { raw = [] }  = wordCard;
  const [ word1 = [], types = [] ] = raw;
  const examples = (raw[13] || [])[0] || [];
  const definitionTypes = raw[12] || [];
  const[ word2 = [], pronunciation = [] ] = word1;
  const[ to = '', from = '' ] = word2;
  return (
    <View className={styles.index}>
      <View className={styles.card} onClick={(event) => { event.preventDefault();event.stopPropagation(); Taro.navigateTo({ url: '/pages/words/index' }) }}>
        <Text className={styles.title}>Examples of <Text style={{ fontWeight: 'bolder', color: '#fff', fontSize: Taro.pxTransform(32) }}>{from}</Text></Text>
        {examples.map((example) => {
          return (
            <View key={example[5]} className={styles.row} style={{ marginTop: Taro.pxTransform(20) }}>
              <Image
                src='https://cdn.liuxuanping.com/calendar_quote.png'
                style={{ margin: `${Taro.pxTransform(12)} ${Taro.pxTransform(32)} 0 ${Taro.pxTransform(32)}`, width: Taro.pxTransform(28), height: Taro.pxTransform(20), background: 'transparent' }}
              />
              <Text className={styles.longest} style={{ fontSize: Taro.pxTransform(28) }} >
                {example[0].replace('<b>', ' ').replace('</b>', ' ')}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default ExampleCard;
