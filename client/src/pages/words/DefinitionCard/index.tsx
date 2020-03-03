import {Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
// import {AtButton, AtIcon} from "taro-ui";

import styles from './index.module.scss';

function DefinitionCard({ wordCard = {} }: any) {
  const { raw = [] }  = wordCard;
  const [ word1 = [], types = [] ] = raw;
  const definitionTypes = raw[12] || [];
  const synonymsTypes = raw[11] || [];
  const[ word2 = [], pronunciation = [] ] = word1;
  const[ to = '', from = '' ] = word2;
  return (
    <View className={styles.index}>
      <View className={styles.card} onClick={(event) => { event.preventDefault();event.stopPropagation(); Taro.navigateTo({ url: '/pages/words/index' }) }}>
        <Text className={styles.title}>Definitions of <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: Taro.pxTransform(32) }}>{from}</Text></Text>
        <View>
        {definitionTypes.map(definitionType => (
          <View key={definitionType[0]}>
            <View className={styles.row} style={{ justifyContent: 'space-between' }}>
              <View style={{ color: '#4285f4' }}>{definitionType[0]}</View>
            </View>
            {definitionType[1].map((definition, index) => (
                <View className={styles.row} key={definition}>
                  <View
                    className={styles.start}
                    style={{
                      width: Taro.pxTransform(32),
                      height: Taro.pxTransform(32),
                      borderRadius: '50%',
                      border: 'solid 1px grey',
                      lineHeight: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: Taro.pxTransform(8),
                      fontSize: Taro.pxTransform(24),
                    }}
                  >{index + 1}</View>
                  <View className={styles.longest}>
                    <View>{definition[0]}</View>
                    <View style={{ fontSize: Taro.pxTransform(28), color: 'gray' }}>{definition[2]}</View>
                    {/*<View>*/}
                    {/*  <View style={{ marginTop: Taro.pxTransform(20), fontSize: Taro.pxTransform(28), color: 'gray' }}>Synonyms:</View>*/}
                    {/*  <View style={{ marginTop: Taro.pxTransform(10), color: 'gray' }}>*/}
                    {/*    <Text*/}
                    {/*      style={{*/}
                    {/*        fontSize: Taro.pxTransform(24),*/}
                    {/*        borderRadius: Taro.pxTransform(50),*/}
                    {/*        border: 'solid 1px gray',*/}
                    {/*        padding: `0 ${Taro.pxTransform(16)}`,*/}
                    {/*        alignItems: 'center',*/}
                    {/*        lineHeight: 1,*/}
                    {/*      }}*/}
                    {/*    >order</Text>*/}
                    {/*  </View>*/}
                    {/*</View>*/}
                  </View>
                </View>
              ))}
          </View>
        ))}
        </View>
      </View>
    </View>
  );
}

export default DefinitionCard;
