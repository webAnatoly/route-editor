import React from 'react';
import s from './style.css';
import Dispatcher from '../../data/appDispatcher';
import {mainStore} from '../../data/Stores';

export default class YandexMap extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div>
        <div id="my_map" className={s.map}></div>
      </div>
    )
  }
  componentDidMount(){
    mainStore.YandexMap.ymaps.ready(function () {
      mainStore.YandexMap.myMap = new mainStore.YandexMap.ymaps.Map("my_map", {
        center: [55.93, 47.79],
        zoom: 10
      });
    });
  }
  componentWillUpdate(){
    console.log('update');
  }
}