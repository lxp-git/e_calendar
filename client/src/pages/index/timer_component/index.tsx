import Taro  from '@tarojs/taro';
import {Text, Button, View} from '@tarojs/components';
import moment from "moment";

function TimerComponent(props: { onTimeClick: (data) => void }) {
  const [ _nowLocaleString, setNowLocaleString ] = Taro.useState(moment().format('YYYY/MM/DD HH:mm:ss'));

  Taro.useEffect(() => {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      setNowLocaleString(() => moment().format('YYYY/MM/DD HH:mm:ss'));
    }, 1000);
    return function cleanup() {
      clearInterval(this.timer);
    }
  }, []);

  return (
    <Button
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
      onClick={props.onTimeClick}
    >
      <View style={{ backgroundColor: 'transparent', padding: Taro.pxTransform(32) }} >
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
