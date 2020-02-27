import {Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import styles from './index.module.scss'

export default function DateDetail({ children }) {
  return (
    <View className={styles.index}>
      <View className={styles.card}>
        <View className={styles.selectedDetail}>
          <Text selectable>{children}</Text>
          <Text></Text>
        </View>
      </View>
    </View>
  );
}
