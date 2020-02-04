import Taro, { Component } from "@tarojs/taro"
import {AtButton, AtForm} from "taro-ui";

export default class AppButton extends Component {

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <AtForm
        onSubmit={(event) => {
          // "the formId is no longer available in develop or trial version of this mini program"
          if (event.detail.formId !== 'the formId is no longer available in develop or trial version of this mini program') {
            Taro.cloud.callFunction({
              name: 'saveFormId',
              data: {
                formId: event.detail.formId,
              }
            }).then(res => console.log('saveFormId', res));
          }
        }}
      >
        <AtButton formType='submit' {...this.props}>{this.props.children}</AtButton>
      </AtForm>
    )
  }
}
