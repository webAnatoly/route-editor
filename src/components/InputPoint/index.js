import React from 'react';
import s from './style.css';

export default class InputPoint extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleKeyUp(event) {
    this.props.onHandleKeyUP(event);
  }

  render() {
    return (
      <input type="text" className={s.main} defaultValue="" onKeyUp={this.handleKeyUp} autoFocus/>
    )
  }

}