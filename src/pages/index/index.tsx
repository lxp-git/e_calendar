import Taro from '@tarojs/taro'
import React from 'react'
import { View, Image, Input } from '@tarojs/components'
import { connect } from "react-redux";

import assets from '../../assets';
import application from "../../utils/Application";
import { createAction, isLogin, StyleSheet } from "../../utils";
import './index.global.scss';
import PageContainer from '../../components/PageContainer';
import WeekCalendar from './WeekCalendar';
import Drawer from "./Drawer";
import Calendar from './Calendar';
import Diary from './Diary';
import { convertToYearMonthDate } from '../../utils/date_utils';

const styles = StyleSheet.create({
  index: { height: '100%', overflow: 'hidden' },
  body: { display: 'flex', flex: 1, height: '100%', flexDirection: 'column' },
  calendar: { display: "flex", flex: 1, width: "100%", height: 0, },
  leftButton: { display: "flex", justifyContent: 'center', alignItems: 'center', width: Taro.pxTransform(44), height: Taro.pxTransform(44) }
})

// moment.updateLocale("zh", { week: {
//     dow: 1, // 星期的第一天是星期一
//     doy: 7  // 年份的第一周必须包含1月1日 (7 + 1 - 1)
//   }});

const leftImage = (
  <Image
    style={styles.leftButton}
    src={assets.images.iconMenuWhite}
  />
);

function Index(props) {
  const { dispatch, selectedViewModel } = props;
  const _onSelectYearAndMonth = React.useCallback((date) => {
    date.type = "change";
    dispatch(createAction('home/selectYearAndMonth')({ date }));
  }, [dispatch]);

  React.useEffect(() => {
    Taro.showShareMenu({
      withShareTicket: true,
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment'],
    });
    dispatch(createAction('global/save')({ themePrimary: application.setting.themePrimary }));
    _onSelectYearAndMonth({
      type: 'change',
      detail: { value: convertToYearMonthDate() },
    });
    if (!isLogin()) {
      dispatch(createAction('home/login')({}));
    }
    // this._fetchEvent(); // 获取大姨妈以及笔记事件，在_onSelectYearAndMonth
    const _qrCodeLogin = () => {
      if (Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) return;
      const scene = Taro.getCurrentInstance().router?.params.scene;
      dispatch(createAction('global/handleQrCode')({
        scene,
      }));
    }
    _qrCodeLogin();
    // debug
    // Taro.navigateTo({ url: '/pages/words/index' });
  }, [_onSelectYearAndMonth, dispatch])

  Taro.useShareTimeline(() => {
    return {
      path: 'pages/index/index',
      title: '一个日历，做一个简洁实用的小程序日历工具',
    }
  })
  Taro.useShareAppMessage(res => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      path: 'pages/index/index',
      title: '一个日历，做一个简洁实用的小程序日历工具',
    }
  });

  const [isDrawerShowed, setIsDrawerShowed] = React.useState(false);
  const _onClose = () => setIsDrawerShowed(false);
  return (
    <PageContainer
      isCustomLeftButton
      onLeftButtonClick={() => {
        setIsDrawerShowed(true);
      }}
      title={selectedViewModel === 'diary' ? ({ mode }) => {
        let placeholderStyle = "font-size: 14px;";
        switch (mode) {
          case "light": placeholderStyle += "color: #dddddd;"; break;
          case "dark": placeholderStyle += "color: #d5d5d5;"; break;
        }
        return <Input placeholderStyle={placeholderStyle} placeholder='搜索你的记事...' />;
      } : "一个日历"}
      renderLeftButton={leftImage}
      style={styles.index}
    >
      <View style={styles.body} >
        {/*<WeekCalendar style={{ display: "flex", flexDirection: "column", flex: 1 }} />*/}
        <View
          style={styles.calendar}
        >
          {selectedViewModel === 'month' && <Calendar />}
          {selectedViewModel === 'week' && <WeekCalendar />}
          {selectedViewModel === 'diary' && <Diary />}
        </View>
      </View>
      <Drawer isDrawerShowed={isDrawerShowed} onClose={_onClose} />
    </PageContainer>
  );
}
export default connect(({ global: { selectedViewModel } }) => ({ selectedViewModel }))(React.memo(Index));
