import Taro from "@tarojs/taro";
import {Image, Text, View} from "@tarojs/components";

import ListItem from "../../../components/ListItem";
import TaroButton from "../../../components/TaroButton";
import Modal from "../../../components/Modal";
// import application from "../../../utils/Application";


export default function Contact() {
  const [ isContactModalOpened, setIsContactModalOpened ] = React.useState(false);
  return (
    <View>
      <TaroButton
        style={{
          display: "flex",
          width: "100%",
          textAlign: "start",
          backgroundColor: "white",
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 0,
          marginTop: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }}
        onClick={() => {
          setIsContactModalOpened(true);
        }}
      >
        <ListItem title='联系我们' note='有什么问题或者建议都可以联系我们🥳' />
      </TaroButton>
      <Modal isOpened={isContactModalOpened}>
        <View
          onClick={() => { setIsContactModalOpened(false) }}
          style={{ backgroundColor: '#999999', flex: 1, width: "100%", height: "100%", padding: Taro.pxTransform(120), }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: '#ffffff',
              background: 'white',
              opacity: 1,
              paddingTop: Taro.pxTransform(32),
              paddingBottom: Taro.pxTransform(32),
            }}z
          >
            <Image
              src='https://cdn.liuxuanping.com/gh_08eeaa873774_344.jpg'
              style={{ width: Taro.pxTransform(400), height: Taro.pxTransform(400) }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
