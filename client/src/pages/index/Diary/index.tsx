import React from 'react';
import {Text, View, Checkbox, ScrollView} from "@tarojs/components";
import {connect} from "react-redux";
import Taro from "@tarojs/taro";
import moment from "moment";


function Diary({ home = {} }) {
  const { eventMap = {} } = home;
  return (
    <ScrollView scrollY enableFlex style={{ display: 'flex', flexDirection: "row", width: "100%" }} >
      <View style={{ display: "flex", flexDirection: 'column', width: "50%" }}>
        {Object.keys(eventMap).map((key, index) => index % 2 ? (
          <View
            onClick={() => {
              const selectedDay = moment(key);
              Taro.navigateTo({ url: `/pages/event/index?date=${key}` });
            }}
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              padding: "6px 3px 0 6px",
              boxSizing: "border-box",
            }}
          >
            <View style={{ padding: '5px 5px', borderRadius: '5px', backgroundColor: eventMap[key].background }}>
              <Text style={{ fontSize: 12 }}>{eventMap[key].content}</Text>
            </View>
          </View>
        ) : null)}
      </View>
      <View style={{ display: "flex", flexDirection: 'column', width: "50%" }} >
        {Object.keys(eventMap).map((key, index) => index % 2 ? null : (
          <View
            onClick={() => {
              const selectedDay = moment(key);
              Taro.navigateTo({ url: `/pages/event/index?date=${selectedDay.year()}-${selectedDay.month() + 1}-${selectedDay.date()}` });
            }}
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              boxSizing: "border-box",
              padding: "6px 6px 0 3px",
            }}
          >
            <View style={{ padding: '5px 5px', borderRadius: '5px', backgroundColor: eventMap[key].background }}>
              <Text style={{ fontSize: 12 }}>{eventMap[key].content}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default connect(({ home }) => ({ home }))(Diary);
