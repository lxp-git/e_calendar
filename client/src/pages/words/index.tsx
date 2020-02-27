import Taro, {Config} from '@tarojs/taro';
import {View, Text, Button} from '@tarojs/components';
import {AtDivider} from "taro-ui";
import {connect} from "@tarojs/redux";

import ThemePage from "../ThemePage";
import WordCard from "../../components/WordCard";

import './index.global.scss';
import DefinitionCard from "./DefinitionCard";
import ExampleCard from "./ExampleCard";
import {displayDate} from "../../utils/date_utils";
import {createAction} from "../../utils";

@connect(({ home, words, loading }) => ({ home, words, loading }))
export default class Index extends ThemePage {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '单词卡',
    navigationBarBackgroundColor: '#000',
    navigationBarTextStyle: 'white',
    backgroundColor: '#000',
    // disableScroll: true,
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentDidShow() {

  }

  render() {
    // const { loading: { models: { global = true }} } = this.props;
    const { words: { list = [], currentWordCardIndex }, dispatch} = this.props;

    const space = Taro.pxTransform(16);
    const wordCard = list[currentWordCardIndex] || {};
    // R is retrievability (a measure of how easy it is to retrieve a piece of information from memory)
    const { raw = [], url, retrievability = 0.36787944118, time_interval = 1 }  = wordCard;
    let [ word = [] ] = raw;
    [ word = [] ] = word;
    [ word = '' ] = word;
    // S is stability of memory (determines how fast R falls over time in the absence of training, testing or other recall)
    const stability = -time_interval / Math.log(retrievability); // 相对记忆强度
    const stabilityX4 = stability * 4;
    return (
      <View style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column', background: 'black' }}>
        {!!word && (
          <WordCard
            key={word} wordCard={wordCard}
            style={{ background: '#212121', color: '#f4f4f4' }}
            onClick={(event) => {
              event.preventDefault(); event.stopPropagation();
              Taro.setClipboardData({ data: url }).then(() => {
                Taro.showToast({ icon: 'none', title: '已复制来源网址' }) });
            }}
          />)}
        <AtDivider customStyle={{ zIndex: 0 }} height={10} lineColor='transparent' />
        {!!word && (<DefinitionCard wordCard={wordCard} />)}
        {/*<SynonymsCard />*/}
        {!!word && (<ExampleCard wordCard={wordCard} />)}
        {/*<TranslationCard />*/}
        <AtDivider height={140} customStyle={{ zIndex: 0 }} lineColor='#000' />
        <View style={{ display: 'flex', background: '#212121', fontSize: 12, position: 'fixed', bottom: 0,left: 0, right: 0 }}>
          <Button
            style={{ flex: 1, margin: `${space} 0 ${space} ${space}`, textAlign: 'center', background: 'transparent', color: 'white', fontSize: 12 }}
            onClick={() => {
              dispatch(createAction('words/nextWordCard')({
                timeInterval: 1/(24*60),
              }));
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'column', padding: Taro.pxTransform(8), background: '#9d3c38', }}>
              <Text>Again</Text>
              <Text style={{ marginTop: Taro.pxTransform(8) }}>1min</Text>
            </View>
          </Button>
          <Button
            style={{ flex: 1, textAlign: 'center', margin: `${space} 0 ${space} ${space}`, padding: Taro.pxTransform(8), background: '#c07a2a', color: 'white', fontSize: 12 }}
            onClick={() => {
              dispatch(createAction('words/nextWordCard')({
                timeInterval: stability,
              }));
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'column' }}>
              <Text>Hard</Text>
              <Text style={{ marginTop: Taro.pxTransform(8) }}>{displayDate(stability)}</Text>
            </View>
          </Button>
          <Button
            style={{ flex: 1, textAlign: 'center', margin: `${space} ${space} ${space} ${space}`, padding: Taro.pxTransform(8), background: '#4ba630', color: 'white', fontSize: 12 }}
            onClick={() => {
              dispatch(createAction('words/nextWordCard')({
                timeInterval: stabilityX4,
              }));
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'column' }}>
              <Text>Easy</Text>
              <Text style={{ marginTop: Taro.pxTransform(8) }}>{displayDate(stabilityX4)}</Text>
            </View>
          </Button>
        </View>
      </View>
    );
  }
}
