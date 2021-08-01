import React from 'react';
import Taro from "@tarojs/taro";
import {Text, View} from "@tarojs/components";

import application from "../../../utils/Application";
import {StyleSheet} from "../../../utils";
const styles = StyleSheet.create({
  index: {
    "backgroundColor": "white",
    flex: 1,
    width: "100%",
    "display": "flex",
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center",
    boxSizing: "border-box",
  },
  text: {
    "display": "flex",
    "flexGrow": 1,
    "flexShrink": 1,
    "flexBasis": 0,
    "textAlign": "center",
    "justifyContent": "center",
    fontSize: Taro.pxTransform(32),
  }
})
function WeekHeader({ themePrimary }: { themePrimary: string }) {
  return (
    <View style={styles.index}>
      {application.constants.WEEK_DAY_CHINESE.map(itemString =>
        <Text
          style={{ ...styles.text, color: (itemString == '六' || itemString == '日') ? themePrimary : application.constants.textPrimaryColor, }}
          key={itemString}
        >{itemString}</Text>)}
    </View>
  );
}

export default WeekHeader;
