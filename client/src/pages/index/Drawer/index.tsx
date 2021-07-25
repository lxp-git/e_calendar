import React from 'react';
import Taro from "@tarojs/taro";
import {Image, View} from "@tarojs/components";
import { connect } from "react-redux";

import AtDrawer from "../../../components/Drawer";
import ListItem from "../../../components/ListItem";
import application from "../../../utils/Application";
import {createAction, hexToRgbA} from "../../../utils";
import assets from '../../../assets';

function Drawer({ changeMainViewModel, isDrawerShowed, onClose, selected = application.setting.selectedViewModel }: { isDrawerShowed: boolean, onClose: () => void, selected?: 'week' | 'month' | 'note' }) {
  const systemInfo = Taro.getSystemInfoSync();
  const color = application.setting.themePrimary || '#000000';
  const onItemClick = (func) => {
    switch (func) {
      case 'month':
      case 'week':
      case 'diary':
        changeMainViewModel({
          newViewModel: func,
        });
        break;
      case 'bigClock': Taro.navigateTo({ url: '/pages/clock/index' }); break;
      case 'pomodoro': Taro.navigateTo({ url: '/pages/pomodoro/index' }); break;
      default:
    }
    onClose();
  }
  return (
    <AtDrawer show={isDrawerShowed} onClose={onClose} >
      <View style={{ display: 'flex', justifyContent: 'center', paddingTop: Taro.pxTransform(systemInfo.statusBarHeight+20), paddingBottom: Taro.pxTransform(systemInfo.statusBarHeight+20) }}>
        <Image
          style={{ width: Taro.pxTransform(44 * 2), height: Taro.pxTransform(44 * 2) }}
          src={assets.images.logo}
        />
      </View>
      <ListItem onClick={() => onItemClick('month')} style={{ background: selected === 'month' ? hexToRgbA(`${color}`, 0.3) : 'transparent' }} title='月' arrow='right' />
      <ListItem onClick={() => onItemClick('week')} style={{ background: selected === 'week' ? hexToRgbA(`${color}`, 0.3) : 'transparent' }} title='周' arrow='right' />
      <ListItem onClick={() => onItemClick('diary')} title='记事本' arrow='right' />
      <View style={{ height: Taro.pxTransform(2), background: 'lightgray' }} />
      <ListItem onClick={() => onItemClick('bigClock')} title='大时钟' arrow='right' />
      <ListItem onClick={() => onItemClick('pomodoro')} title='番茄钟' arrow='right' />
    </AtDrawer>
  )
}

export default connect(({ global })=>({ global }), (dispatch) => ({
  changeMainViewModel: (payload) => {
      dispatch(createAction('global/changeMainViewModel')(payload));
    },
  })
)(Drawer);
