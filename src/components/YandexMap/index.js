import React from 'react';
import s from './style.css';

export default class YandexMap extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div>
        <div id="first_map" className={s.map}></div>
      </div>
    )
  }
  componentDidMount(){
    // const ymaps = this.props.ymaps;
    let myMap;

    /* 
    Раскомментить когда дойдет дело до работы с картой.
    Закомментил, чтобы каждый раз не ждать её загрузки. 
    Так же не забыть расскомментить в index.html и потом через props'ы прокинуть объект ymaps сюда. 
    */
    
    // ymaps.ready(function () {
    //   myMap = new ymaps.Map("first_map", {
    //     center: [55.93, 37.76],
    //     zoom: 17
    //   });
    // });
  }
}