import React from 'react';
import {TouchableOpacity} from "react-native";

function TaroButton({ onClick = () => { console.log('TaroButton') }, children, ...other }: any) {
  return (
    <TouchableOpacity onPress={onClick} {...other} >
      {children}
    </TouchableOpacity>
  );
}

export default TaroButton;
