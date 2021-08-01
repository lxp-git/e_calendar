import React from 'react';
import Taro  from '@tarojs/taro';
import {Text, Button, View} from '@tarojs/components';
import moment from "moment";
import {StyleSheet} from "../../../utils";

const styles = StyleSheet.create({
  index: { backgroundColor: 'transparent', padding: Taro.pxTransform(32) },
  text: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    fontSize: Taro.pxTransform(32),
    color: "#333333",
    borderRadius: 0,
  }
});

const Timer = React.memo((props: { onTimeClick: (data) => void }) => {
  const [ _nowLocaleString, setNowLocaleString ] = React.useState(moment().format('YYYY/MM/DD HH:mm:ss'));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setNowLocaleString(() => moment().format('YYYY/MM/DD HH:mm:ss'));
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, []);

  const longPress = (event) => {
    Taro.navigateTo({
      url: '/pages/clock/index',
    });
  };
  return (
    <Button
      onClick={props.onTimeClick}
    >
      <View
        style={styles.index}
        onLongPress={longPress}
        onLongClick={longPress}
      >
        <Text style={styles.text}>{_nowLocaleString}</Text>
      </View>
    </Button>
  )
})

export default Timer;
