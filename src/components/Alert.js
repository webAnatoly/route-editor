import React from 'react';

// import Dispatcher from '../../data/appDispatcher';
// import { mainStore } from '../../data/Stores';
// import keyMirror from 'fbjs/lib/keyMirror';

const styles = {
  width: '500px',
  height: '40px',
  position: 'fixed',
  margin: 'auto',
  top: '0px',
  left: '0px',
  backgroundColor: '#ffe6e6',
  padding: '10px',
  textAlign: 'center'
}

let message = 'По указанному запросу ничего не найдено'

export default class Alert extends React.Component {
  render() {
    return (
      <div style={styles}>
        <div>{message}</div>
      </div>
    )
  }
  componentWillUnmount(){
    console.log('component Alert WillUnmount');
  }
}