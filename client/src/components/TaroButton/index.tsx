import React from 'react';
import {Button} from "@tarojs/components";
import {ITouchEvent} from "@tarojs/components/types/common";

function TaroButton({ children, onClick = (event: ITouchEvent) => ({}), style, openType, onGetUserInfo }: any) {
  return (
    <Button onClick={onClick} style={{lineHeight: 1.5, ...style}} openType={openType} onGetUserInfo={onGetUserInfo} >
      {children}
    </Button>
  );
}
export default TaroButton;
