import React from 'react';
import s from './style.css';
import stylesOnePointRow from '../OnePointRow/style.css';

export default class Drag extends React.Component {
  render() {
    const stylesDrag = { // высота будет менятся, поэтому тут оставил. Остальное в style.css
      height: '35px'
    }
    // добавляем в stylesDrag, стили пришедшие из пропсов
    // TODO: [🐱👀] Можно заменить на Object.assign или spread operator
    for (let key in this.props.styles) {
      stylesDrag[key] = this.props.styles[key]; 
    }
    // TODO: [🐱👀] Не ясно, зачем здесь dangerouslySetInnerHTML
    return(
      <div style={stylesDrag} className={`${s.hover} ${s.base} ${stylesOnePointRow.rowContainer}`} dangerouslySetInnerHTML={{__html: this.props.html}}></div>
    )
  }

  componentDidMount(){
    // TODO: [🐱👀] Лишние комментарии
    // console.log('component Drag DidMount');
  }

  componentWillUnmount(){
    // TODO: [🐱👀] Лишние комментарии
    // console.log('component Drag will Unmount');
  }
}