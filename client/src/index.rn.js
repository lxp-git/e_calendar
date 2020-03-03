import {AppRegistry, Text, YellowBox} from 'react-native';

import App from './app';
import {name as appName} from './app.json';
import application from "./utils/Application";

function Root() {
  const [ asyncInit, setAsyncInit ] = React.useState(true);
  React.useEffect(() => {
    application.asyncInit().then(() => {
      setAsyncInit(false);
    });
  }, []);
  return asyncInit ? (
    // eslint-disable-next-line react/react-in-jsx-scope
    <Text>Loading...</Text>
  ) : (
    // eslint-disable-next-line react/react-in-jsx-scope
    <App />
  );
}
console.disableYellowBox = true;
YellowBox.ignoreWarnings(["Warning:"]);
AppRegistry.registerComponent(appName, () => Root);
