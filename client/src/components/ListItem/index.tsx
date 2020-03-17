import {Switch, Text, View, Image, Button} from "@tarojs/components";
import Taro from '@tarojs/taro';
import {CommonEventFunction, ITouchEvent} from "@tarojs/components/types/common";
import application from "../../utils/Application";
import assets from "../../assets";

export default function ListItem(
  { arrow, title, isSwitch, switchIsCheck, onSwitchChange, onClick, switchColor, note }: {
    arrow?: 'right'| 'top' | 'bottom', title?: string, isSwitch?: boolean, switchIsCheck?: boolean,
    onSwitchChange?: CommonEventFunction<{ value: boolean }>,
    onClick?: (event: ITouchEvent) => any, switchColor?: string, note?: string,
  }
) {
  const px32 = Taro.pxTransform(32);
  const px48 = Taro.pxTransform(48);
  const px28 = Taro.pxTransform(28);
  const px42 = Taro.pxTransform(42);
  return (
    <Button onClick={onClick}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: px32,
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: 'white',
          justifyContent: 'space-between'
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'column', flex: 1, width: 0, }}>
          <Text style={{ fontSize: px32, lineHeight: px48 }}>{title}</Text>
          <Text style={{ color: '#666666', fontSize: px28, lineHeight: px42 }}>{note}</Text>
        </View>
        {isSwitch && (<Switch color={switchColor || application.setting.themePrimary} onChange={onSwitchChange} checked={switchIsCheck} />)}
        {arrow && arrow === 'right' && (<Image style={{ width: px48, height: px48 }} src={assets.images.iconArrowRight} />)}
        {arrow && arrow === 'top' && (<Image style={{ width: px48, height: px48 }} src={assets.images.iconArrowUp} />)}
        {arrow && arrow === 'bottom' && (<Image style={{ width: px48, height: px48 }} src={assets.images.iconArrowDown} />)}
      </View>
    </Button>
  );
}
