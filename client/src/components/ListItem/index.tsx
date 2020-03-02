import {Switch, Text, View} from "@tarojs/components";
import Taro from '@tarojs/taro';
import {CommonEventFunction, ITouchEvent} from "@tarojs/components/types/common";
import application from "../../utils/Application";

export default function ListItem(
  { title, isSwitch, switchIsCheck, onSwitchChange, onClick, switchColor, note }: {
    title?: string, isSwitch?: boolean, switchIsCheck?: boolean,
    onSwitchChange?: CommonEventFunction<{ value: boolean }>,
    onClick?: (event: ITouchEvent) => any, switchColor?: string, note?: string,
  }
) {
  const px32 = Taro.pxTransform(32);
  return (
    <View
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: px32,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'space-between'
      }}
    >
      <View>
        <Text style={{ fontSize: px32 }}>{title}</Text>
        <Text style={{ color: '#666666' }}>{note}</Text>
      </View>
      {isSwitch && (<Switch color={switchColor || application.setting.themePrimary} onChange={onSwitchChange} checked={switchIsCheck} />)}
    </View>
  );
}
