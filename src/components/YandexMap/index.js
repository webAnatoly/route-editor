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
    // const ymaps = window.ymaps;
    let myMap;
    
    // ymaps.ready(function () {
    //   myMap = new ymaps.Map("first_map", {
    //     center: [55.93, 37.76],
    //     zoom: 17
    //   });
    // });
  }
}