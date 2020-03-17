import Taro from '@tarojs/taro';
import {View} from "@tarojs/components";
import NavigationBar from "../NavigationBar";

function PageContainer({ children, style, title, isCustomLeftButton, renderLeftButton, onLeftButtonClick }: any) {
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
        onLeftButtonClick={onLeftButtonClick}
      />
      <View style={{ display: 'flex', flexDirection: "column" }}>
        {children}
      </View>
    </View>
  );
}

export default PageContainer;
