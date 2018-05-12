import React from 'react';

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
}