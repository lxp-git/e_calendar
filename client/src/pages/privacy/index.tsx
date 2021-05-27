import React from 'react';
import { View, Text } from "@tarojs/components";
import { Tabs } from '../../components/PageView';

export default function Index() {
  return (
    <Tabs tabs={[
      { key: 't1', title: 't1' },
      { key: 't2', title: 't2' },
      { key: 't3', title: 't3' },
      { key: 't4', title: 't4' },
      { key: 't5', title: 't5' },
    ]} initalPage={'t2'}
    >
      <View key="t1"><Text>content1</Text></View>
      <View key="t2"><Text>content2</Text></View>
      <View key="t3"><Text>content3</Text></View>
      <View key="t4"><Text>content4</Text></View>
      <View key="t5"><Text>content5</Text></View>
    </Tabs>
  );
}
