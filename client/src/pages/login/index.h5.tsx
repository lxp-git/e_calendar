import {CircularProgress, Box, Typography, Button, ListItemText, Snackbar} from "@material-ui/core";
import React from "react";

import styles from './index.module.scss'
import classNames from "classnames";
import * as queryString from "querystring";
import application from "../../application";

enum QRCodeLoading {
  loading,
  fail,
  success
}

export default function Login() {
  const [ loading, setLoading ] = React.useState(QRCodeLoading.loading);
  const [ imageUrl, setImageUrl ] = React.useState(application.calendarBaseUrl + '/calendar/user/miniProgramQRCode');//React.useState('https://app.liuxuanping.com/public/api.php/');
  React.useEffect(() => {
    const timer = setInterval(() => {
      fetch(application.calendarBaseUrl + '/calendar/user')
        .then(response => {
          if (response.ok) {
            console.log('document.cookie', document.cookie);
            const keyValues = document.cookie.split(';');
            const cookieMap: any = {};
            keyValues.forEach((keyValues) => {
              const array = keyValues.split('=');
              cookieMap[array[0]] = array[1];
            });
            response.json().then(responseJson => {
              const payload = {
                method: "accountLogin",
                arguments: {
                  accessToken: cookieMap['PHPSESSID'],
                  PHPSESSID: cookieMap['PHPSESSID'],
                  loginUser: responseJson
                }
              };
              console.log('window.postMessage', payload);
              // @ts-ignore
              window.postMessage({
                source: "calendar-words-extension-bridge",
                payload,
              });
              clearInterval(timer);
              window.location.href = '/';
            });
          }
        });
    }, 3000);
    // Specify how to clean up after this effect:
    return function cleanup() {
      clearInterval(timer);
    };
  });
  return (
    <Box className={styles.index} justifyContent='center' alignItems={'center'} flexDirection={'column'}>
      <Box>
        <Box className={styles.imageContainer} justifyContent='center' alignItems={'center'}>
          <img
            className={styles.image}
            onLoad={() => {setLoading(QRCodeLoading.success)}}
            onError={() => {setLoading(QRCodeLoading.fail)}}
            src={imageUrl}
          />
          {loading !== QRCodeLoading.success && (<div className={classNames(styles.grayBackground, styles.overlay)} />)}
          {loading === QRCodeLoading.loading && (<CircularProgress className={styles.overlay} />)}
          {loading === QRCodeLoading.fail && (
            <Button
              onClick={() => {
                const url = new URL(imageUrl);
                let retry = url.searchParams.get('retry');
                if (!retry) {
                  retry = '0';
                }
                url.searchParams.set('retry', (parseInt(retry, 10) + 1).toString());
                setLoading(QRCodeLoading.loading);
                setTimeout(() => {
                  setImageUrl(url.href);
                }, 600);
              }}
              className={styles.overlay}>加载失败，点我刷新</Button>)}
        </Box>
        <ListItemText primary={'请用微信扫描即可完成登录'} style={{ textAlign: 'center' }} />
      </Box>
    </Box>
  );
}