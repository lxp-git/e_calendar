import Taro, {Config} from '@tarojs/taro'
import {View, Text, Picker, Button, Image} from '@tarojs/components'
import {connect} from "@tarojs/redux";

import application from "../../utils/Application";
import PageContainer from "../../components/PageContainer";

const taskSeconds = 25 * 60;
function WrapComponent(props) {
  const [ seconds, setSeconds ] = Taro.useState(taskSeconds);
  const [ timer, setTimer ] = Taro.useState();
  // Taro.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setSeconds(seconds - 1);
  //     console.log('seconds', seconds);
  //     if (seconds <= 0) {
  //       clearInterval(this.timer);
  //     }
  //   }, 1000);
  //   return function cleanup() {
  //     // console.log('cleanup', timer);
  //     clearInterval(timer);
  //   };
  // }, [seconds]);
  // console.log('timer', seconds);
  const minute = parseInt((seconds / 60).toString(), 10);
  const minuteString = minute >= 10 ? minute + '' : `0${minute}`;
  const second = parseInt((seconds % 60).toString(), 10);
  const secondString = second >= 10 ? second + '' : `0${second}`;

  const _timerCallback = () => {
    setSeconds(prevCount => prevCount - 1);
  }

  const _startTimer = () => {
    clearInterval(timer);
    setTimer(prevState => setInterval(_timerCallback, 1000));
  };

  if (seconds <= 0 && timer) {
    Taro.showModal({
      title: '恭喜',
      content: '完成了一个任务',
    });
    Taro.vibrateLong();
    clearInterval(timer);
    setSeconds(prevState => taskSeconds);
    setTimer(() => null);
  }

  return (
    <PageContainer title='一个日历 | 番茄钟'>
      <View
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Text style={{ textAlign: "center", fontSize: Taro.pxTransform(88 * 2), width: Taro.pxTransform(88 * 1.2) }}>
            {minuteString.substring(0, 1)}
          </Text>
          <Text style={{ textAlign: "center", fontSize: Taro.pxTransform(88 * 2), width: Taro.pxTransform(88 * 1.2) }}>
            {minuteString.substring(1, 2)}
          </Text>
          <Text style={{ textAlign: "center", lineHeight: 1.2, fontSize: Taro.pxTransform(88 * 2), width: Taro.pxTransform(58) }}>
            :
          </Text>
          <Text style={{ textAlign: "center", fontSize: Taro.pxTransform(88 * 2), width: Taro.pxTransform(88 * 1.2) }}>
            {secondString.substring(0, 1)}
          </Text>
          <Text style={{ textAlign: "center", fontSize: Taro.pxTransform(88 * 2), width: Taro.pxTransform(88 * 1.2) }}>
            {secondString.substring(1, 2)}
          </Text>
        </View>
        <Button
          style={{
            background: props && props.global && props.global.themePrimary,
            color: 'white',
            borderRadius: Taro.pxTransform(50),
            opacity: timer ? 0.5 : 1,
          }}
          disabled={timer}
          onClick={_startTimer}
        >
          <View
            style={{
              paddingLeft: Taro.pxTransform(20 * 2),
              paddingRight: Taro.pxTransform(20 * 2),
              paddingTop: Taro.pxTransform(4 * 2),
              paddingBottom: Taro.pxTransform(4 * 2),
            }}
          >
          <Text>
            开始工作
          </Text>
          </View>
        </Button>
        <View style={{ display: "flex", flexDirection: "column", marginTop: Taro.pxTransform(50),  width: '100%' }}>
          <Text style={{ fontSize: Taro.pxTransform(16 * 2), textAlign: 'center', fontWeight: 'bold' }}>
            番茄工作法：最简单有效的时间管理方式
          </Text>
          <View
            style={{
              marginTop: Taro.pxTransform(16),
              paddingLeft: Taro.pxTransform(32),
              fontSize: Taro.pxTransform(14 * 2),
              color: '#333333',
              whiteSpace: 'break-spaces',
            }}
          >
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ width: Taro.pxTransform(16 * 2 * 1.2) }}>1.</Text>
              <Text>将番茄时间设为25分钟点【开始工作】</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ width: Taro.pxTransform(16 * 2 * 1.5) }}>2.</Text>
              <Text>专注工作，中途不允许做任何与该任务无关的事，直到番茄时钟响起</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ width: Taro.pxTransform(16 * 2 * 1.2) }}>3.</Text>
              <Text>然后短暂休息一下，5分钟左右</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ width: Taro.pxTransform(16 * 2 * 1.2) }}>4.</Text>
              <Text>每四个任务，休息30分钟</Text>
            </View>
          </View>
        </View>
      </View>
    </PageContainer>
  );
}
// const Index = connect(({ global, home, words }) => ({ global, home, words }))(WrapComponent)
// Index.config = {};
// Index.config['navigationBarTitleText'] = "一个日历";
// Index.config['navigationBarTextStyle'] = "white";
// Index.config['backgroundColor'] = "#f4f4f4";
WrapComponent.navigationOptions = ({ navigation }) => {
  return ({
    title: 'Home',
    headerStyle: {
      backgroundColor: application.setting.themePrimary,
      elevation: 0,
    },
    headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    //   color: '#000',
    // },
  });
}
// export default WrapComponent;
export default connect(({ global }) => ({ global }))(WrapComponent);
