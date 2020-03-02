import Index from './index';
import application from "../../utils/Application";

Index.navigationOptions = ({ navigation }) => {
  return ({
    title: 'Home',
    headerStyle: {
      backgroundColor: application.setting.themePrimary,
      elevation: 0,
    },
    headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    //   color: '#000',
    // },
  });
}

export default Index;
