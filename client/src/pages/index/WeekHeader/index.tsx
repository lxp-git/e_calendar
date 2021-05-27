import React from 'react';
import Taro from "@tarojs/taro";
import {Text, View} from "@tarojs/components";

import application from "../../../utils/Application";

function WeekHeader({ themePrimary }: { themePrimary: string }) {
  return (
    <View style={{
      "backgroundColor": "white",
      flex: 1,
      width: "100%",
      "display": "flex",
      "flexDirection": "row",
      "justifyContent": "center",
      "alignItems": "center",
      boxSizing: "border-box",
    }}
    >
      {application.constants.WEEK_DAY_CHINESE.map(itemString =>
        <Text
          style={{
            "display": "flex",
            "flexGrow": 1,
            "flexShrink": 1,
            "flexBasis": 0,
            "textAlign": "center",
            "justifyContent": "center",
            fontSize: Taro.pxTransform(32),
            color: (itemString == '六' || itemString == '日') ? themePrimary : application.constants.textPrimaryColor,
          }}
          key={itemString}
        >{itemString}</Text>)}
    </View>
  );
}

export default WeekHeader;
