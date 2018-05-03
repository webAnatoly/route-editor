import React from 'react';
import s from './style.css';

export default class InputPoint extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.inputValue = '';
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.props.onHandleKeyPress(event.target.value);
    }
  }

  hanldeClick() {
    this.props.onHandleKeyPress(this.inputValue);
  }

  handleChange(event) {
    this.inputValue = event.target.value;
  }

  render() {
    return (
      <label>
        <input type="text" className={s.main} defaultValue="" onKeyPress={this.handleKeyPress.bind(this)} autoFocus ref={this.myRef} onChange={this.handleChange.bind(this)}/>
        <span className={s.search} onClick={this.hanldeClick.bind(this)}>&#128269;</span>
      </label>
    )
  }

}