import React from 'react';
import {Text, View, Checkbox} from "@tarojs/components";
import Taro from "@tarojs/taro";

import styles from "./index.module.scss";

export default function Todo() {
  return (
    <View className={styles.eventBody}>
      <View className={styles.eventRow}>
        <Checkbox
          checked
          value='大姨妈来了'
        />
        <Text className={styles.text}>大姨妈来了</Text>
      </View>
      <View className={styles.eventRow}>
        <Checkbox
          checked
          value='大姨妈来了'
        />
        <Text className={styles.text}>大姨妈来了</Text>
      </View>
    </View>
  );
}
