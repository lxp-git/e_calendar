import Taro from '@tarojs/taro';
import {View} from "@tarojs/components";

function PageContainer({ children, style, title, isCustomLeftButton, renderLeftButton }: any) {
  return (
    <View
      style={{
        display: 'flex',
        minHeight: '100%',
        width: '100%',
        flexDirection: "column",
        backgroundColor: '#f4f4f4',
        ...style,
      }}
    >
      {children}
    </View>
  );
}

export default PageContainer;
