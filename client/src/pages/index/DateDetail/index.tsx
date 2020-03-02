import {Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";

export default function DateDetail({ children }) {
  return (
    <View>
      <View
        style={{
          marginTop: Taro.pxTransform(10),
          marginBottom: Taro.pxTransform(10),
          marginLeft: Taro.pxTransform(10),
          marginRight: Taro.pxTransform(10),
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: Taro.pxTransform(20),
          }}
        >
          <Text selectable>{children}</Text>
        </View>
      </View>
    </View>
  );
}
