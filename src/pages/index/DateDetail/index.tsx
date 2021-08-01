import {Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from 'react';
import {StyleSheet} from "../../../utils";

const styles = StyleSheet.create({
  index: {
    marginTop: Taro.pxTransform(10),
    marginBottom: Taro.pxTransform(10),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: Taro.pxTransform(20),
    background: "white",
  }
});

const DateDetail = React.memo(({ children, onClick }) => {
  return (
    <View
      onClick={onClick}
      style={styles.index}
    >
      <Text style={{ fontSize: Taro.pxTransform(32) }}>{children}</Text>
    </View>
  );
});

export default DateDetail;
