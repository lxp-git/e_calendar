import Taro  from '@tarojs/taro';
import {Text, Button} from '@tarojs/components';
import moment from "moment";

export default function TimerComponent(props: { onClick: () => void }) {
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

  const { onClick } = props;
  return (
    <Button
      onLongPress={() => {
        Taro.navigateTo({
          url: '/pages/clock/index',
        });
      }}
      onLongClick={() => {
        Taro.navigateTo({
          url: '/pages/clock/index',
        });
      }}
      onClick={onClick} style={{ backgroundColor: '#ffffff' }}
    >
      <Text
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: Taro.pxTransform(32),
          paddingRight: Taro.pxTransform(32),
          paddingTop: Taro.pxTransform(32),
          paddingBottom: Taro.pxTransform(32),
          margin: 0,
          backgroundColor: 'white',
          fontSize: Taro.pxTransform(32),
          color: "#444444",
          borderRadius: 0,
        }}
      >{_nowLocaleString}</Text>
    </Button>
  )
}
