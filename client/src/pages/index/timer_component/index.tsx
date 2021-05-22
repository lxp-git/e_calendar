import React from 'react';
import Taro  from '@tarojs/taro';
import {Text, Button, View} from '@tarojs/components';
import moment from "moment";

function TimerComponent(props: { onTimeClick: (data) => void }) {
  const [ _nowLocaleString, setNowLocaleString ] = React.useState(moment().format('YYYY/MM/DD HH:mm:ss'));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setNowLocaleString(() => moment().format('YYYY/MM/DD HH:mm:ss'));
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, []);

  return (
    <Button
      onClick={props.onTimeClick}
    >
      <View
        style={{ backgroundColor: 'transparent', padding: Taro.pxTransform(32) }}
        onLongPress={(event) => {
          Taro.navigateTo({
            url: '/pages/clock/index',
          });
        }}
        onLongClick={(event) => {
          Taro.navigateTo({
            url: '/pages/clock/index',
          });
        }}
      >
        <Text
          style={{
            justifyContent: "center",
            alignItems: "center",
            margin: 0,
            fontSize: Taro.pxTransform(32),
            color: "#333333",
            borderRadius: 0,
          }}
        >{_nowLocaleString}</Text>
      </View>
    </Button>
  )
}

export default TimerComponent;
