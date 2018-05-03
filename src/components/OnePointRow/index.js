import React from 'react';
import ReactDOM from 'react-dom';
import s from './style.css';

export default class OnePointRow extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      startDrag: false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.onRemove(this.props.id);
  }
  
  render() {
    let hover = this.props.hoverON ? s.hover : '';
    return (
      <div ref={this.myRef} className={`${s.rowContainer} ${hover}`}>
          <span className={`${s.noSelect}`}>Точка маршрута {this.props.id + 1} {this.props.value}</span>
          <button className={s.button} onClick={this.handleClick}><span className={s.noSelect}>&#10005;</span></button>
      </div>
    )
  }
}