import Taro, { Component } from "@tarojs/taro"
import {Button, Form} from "@tarojs/components";

export default class AppButton extends Component {

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <Form
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
        <Button formType='submit' {...this.props}>{this.props.children}</Button>
      </Form>
    )
  }
}
