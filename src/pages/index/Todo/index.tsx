import React from 'react';
import {Text, View, Checkbox} from "@tarojs/components";

import styles from "./index.module.scss";

export default function Todo() {
  return (
    <View className={styles.eventBody}>
      <View className={styles.eventRow}>
        <Checkbox
          checked
          value='TEST'
        />
        <Text className={styles.text}>TEST</Text>
      </View>
      <View className={styles.eventRow}>
        <Checkbox
          checked
          value='TEST'
        />
        <Text className={styles.text}>TEST</Text>
      </View>
    </View>
  );
}
