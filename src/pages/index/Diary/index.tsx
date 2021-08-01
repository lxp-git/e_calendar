import React from 'react';
import {Text, View, ScrollView} from "@tarojs/components";
import {connect} from "react-redux";
import Taro from "@tarojs/taro";
import moment from "moment";

import {StyleSheet} from "../../../utils";

const styles = StyleSheet.create({
  index: { display: 'flex', flexDirection: "row", width: "100%" },
  itemContainer: { display: "flex", flexDirection: 'column', width: "50%" },
  leftItem: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    padding: "6px 3px 0 6px",
    boxSizing: "border-box",
  },
  rightItem: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    boxSizing: "border-box",
    padding: "6px 6px 0 3px",
  },
  contentContainer: { padding: '5px 5px', borderRadius: '5px' },
  text: { fontSize: 12 }
})

const Diary = React.memo(({ eventMap }) => {
  return (
    <ScrollView scrollY enableFlex style={styles.index} >
      <View style={styles.itemContainer}>
        {Object.keys(eventMap).map((key, index) => index % 2 ? (
          <View
            onClick={() => {
              Taro.navigateTo({ url: `/pages/event/index?date=${key}` });
            }}
            style={styles.leftItem}
          >
            <View style={{ backgroundColor: eventMap[key].background, ...styles.contentContainer }}>
              <Text style={styles.text}>{eventMap[key].content}</Text>
            </View>
          </View>
        ) : null)}
      </View>
      <View style={styles.itemContainer} >
        {Object.keys(eventMap).map((key, index) => index % 2 ? null : (
          <View
            onClick={() => {
              const selectedDay = moment(key);
              Taro.navigateTo({ url: `/pages/event/index?date=${selectedDay.year()}-${selectedDay.month() + 1}-${selectedDay.date()}` });
            }}
            style={styles.rightItem}
          >
            <View style={{ backgroundColor: eventMap[key].background, ...styles.contentContainer }}>
              <Text style={styles.text}>{eventMap[key].content}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
});

export default connect(({ home: { eventMap } }) => ({ eventMap }))(Diary);
