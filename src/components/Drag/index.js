import React from 'react';
import s from './style.css';

export default class Drag extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log(this.props);
    const stylesDrag = { // высота будет менятся, поэтому тут оставил. Остальное в style.css
      height: '35px'
    }
    // добавляем в базовые стили, стили пришедшие из пропсов
    for (let key in this.props.styles) {
      stylesDrag[key] = this.props.styles[key]; 
    }
    return(
      <div style={stylesDrag} className={`${s.hover} ${s.main}`} dangerouslySetInnerHTML={{__html: this.props.html}}></div>
    )
  }
}