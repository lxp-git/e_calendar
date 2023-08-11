import React, { CSSProperties } from 'react';
import { Button, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
// import {AtIcon} from "taro-ui";
import { ITouchEvent } from "@tarojs/components/types/common";

import styles from './index.module.scss'
import { useAppSelector } from '../../dva';

const innerAudioContext = Taro.createInnerAudioContext();

function playTTS(url) {
  innerAudioContext.src = url;
  innerAudioContext.autoplay = true;
  innerAudioContext.play();
}

export default React.memo(({ onClick = () => { }, style = { color: 'black' } }: { onClick?: (event: ITouchEvent) => void, style?: CSSProperties }) => {
  const wordCard = useAppSelector(state => {
    const words = state.words;
    return words && words.list && words.list.length > 0 && words[0];
  });
  const { raw = [], whole_text = '', tts } = wordCard;
  const [word1 = [], types = []] = raw;
  /// todo types为null其实说明查的是几个词
  const [word2 = [], pronunciation = []] = word1;
  const [to = '', from = ''] = word2;
  return (
    <View style={style} className={styles.card} onClick={onClick}>
      <View className={styles.selectedDetail}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>{from}</Text>
            <Button onClick={(event) => { event.preventDefault(); event.stopPropagation(); playTTS(tts) }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: Taro.pxTransform(30) }}>
                <View className={styles.playIcon} >
                  {/*<AtIcon value='volume-plus' color={style.color} />*/}
                </View>
                {pronunciation[3] && (<Text style={{ color: style.color }} >[{pronunciation[3]}]</Text>)}
              </View>
            </Button>
          </View>
          {(types && types.length > 0) && <Text style={{ color: '#4285f4' }}>{to}</Text>}
        </View>
        {(types && types.length > 0) ? types.map(type => (
          <View key={type.type} style={{ margin: `0 0 ${Taro.pxTransform(20)} 0`, display: 'flex', flexDirection: 'row' }}>
            <Text style={{ color: '#4285f4' }}>
              {type[0]}
            </Text>
            <Text style={{ flex: 1, marginLeft: Taro.pxTransform(40) }}>
              {type[1].join('; ')}
            </Text>
          </View>
        )) : <View>{to}</View>}
        <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          {/*<Text style={{ color: '#4285f4' }}>原文</Text>*/}
          <Text
            className={styles.wholeText}
          >
            {whole_text.trim().replace('\n', ' ')}
          </Text>
        </View>
      </View>
    </View>
  );
});
