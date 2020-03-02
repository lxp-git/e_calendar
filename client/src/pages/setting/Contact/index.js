import Taro from "@tarojs/taro";

import ListItem from "../../../components/ListItem";
import TaroButton from "../../../components/TaroButton";

export default function Contact() {
  return (
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
      openType='contact'
    >
      <ListItem title='联系我们' note='有什么问题或者建议都可以联系我们🥳' />
    </TaroButton>
  );
}
