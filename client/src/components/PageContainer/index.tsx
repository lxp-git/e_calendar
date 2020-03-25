import Taro from '@tarojs/taro';
import {View} from "@tarojs/components";
import NavigationBar from "../NavigationBar";
import {CSSProperties} from "react";

function PageContainer({ children, style, title, isCustomLeftButton = false, renderLeftButton, onLeftButtonClick, navigationBarStyle }: {
  children: any, style?: CSSProperties, title?: string, isCustomLeftButton?: boolean, renderLeftButton?: React.ReactElement, onLeftButtonClick?: () => void, navigationBarStyle?: object,
}) {
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
      <NavigationBar
        title={title}
        isCustomLeftButton={isCustomLeftButton}
        renderLeftButton={
          <View>
            {renderLeftButton}
          </View>
        }
        style={navigationBarStyle}
        onLeftButtonClick={onLeftButtonClick}
      />
      <View style={{ display: 'flex', flex: 1, flexDirection: "column", height: 0 }}>
        {children}
      </View>
    </View>
  );
}

export default PageContainer;
