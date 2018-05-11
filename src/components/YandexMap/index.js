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

      // Создаем коллекцию геообъектов для точек
      mainStore.YandexMap.myGeoObjectCollectionPoints = new mainStore.YandexMap.ymaps.GeoObjectCollection({}, {
        preset: "islands#redCircleIcon",
        geodesic: true
      })

      // Создаем коллекцию геообъектов для линий.
      mainStore.YandexMap.myGeoObjectCollectionLines = new mainStore.YandexMap.ymaps.GeoObjectCollection({}, {
        preset: "",
        strokeWidth: 4,
        geodesic: true
      });

      // Добавляем геоколлекции на карту
      mainStore.YandexMap.myMap.geoObjects.add(mainStore.YandexMap.myGeoObjectCollectionLines);
      mainStore.YandexMap.myMap.geoObjects.add(mainStore.YandexMap.myGeoObjectCollectionPoints);

      // Добавляем балун
      const balloon = new ymaps.Balloon(mainStore.YandexMap.myMap);
      // balloon.options.setParent(mainStore.YandexMap.myMap);
      balloon.open(mainStore.YandexMap.myMap.getCenter());
    });
  }
  componentWillUpdate(){
    // console.log('update');
  }
}