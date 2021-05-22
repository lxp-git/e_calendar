import {Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from 'react';

export default function DateDetail({ children, onClick }) {
  return (
    <View
      onClick={onClick}
    >
      <View
        style={{
          marginTop: Taro.pxTransform(10),
          marginBottom: Taro.pxTransform(10),
          // marginLeft: Taro.pxTransform(10),
          // marginRight: Taro.pxTransform(10),
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: Taro.pxTransform(20),
            background: "white",
          }}
        >
          <Text style={{ fontSize: Taro.pxTransform(32) }}>{children}</Text>
        </View>
      </View>
    </View>
  );
}
