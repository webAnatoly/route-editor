import React from 'react';
import s from './style.css';
import Dispatcher from '../../data/appDispatcher';
import {mainStore} from '../../data/Stores';

Dispatcher.register((action)=>{
  switch(action.type){
    case 'YANDEX_MAP_SET_CENTER': 
      mainStore.YandexMap.ymaps.ready(()=>{
        let myGeocoder = mainStore.YandexMap.ymaps.geocode(action.value);
        myGeocoder.then(
          function (res) {
            if (res.geoObjects.get(0) !== null) {
              let coordsArr = res.geoObjects.get(0).geometry.getCoordinates();
              mainStore.YandexMap.myMap.setCenter(coordsArr);
              const myPlacemark = new ymaps.Placemark(coordsArr, {}, {
                draggable: true, // Метку можно перемещать.
                preset: 'islands#whiteStretchyIcon'
              });
              console.log('placemark', myPlacemark);
              /*
              // Создаем геообъект с типом геометрии "Точка".
              let myGeoObject = new mainStore.YandexMap.ymaps.GeoObject({
                // Описание геометрии.
                geometry: {
                  type: "Point",
                  coordinates: coordsArr
                },
                // Свойства.
                properties: {
                  // Контент метки.
                  iconContent: 'Метка',
                  balloonContent: 'Меня можно перемещать'
                }
              }, {
                  // Опции.
                  // Иконка метки будет растягиваться под размер ее содержимого.
                  preset: 'twirl#redStretchyIcon',
                  // Метку можно перемещать.
                  draggable: true
                })
              */

            } else {
              console.log('res.geoObjects.get(0) === null', res.geoObjects.get(0));
            }
          },
          function (err) {
            console.log('ошибка в myGeocoder', err);
            // обработка ошибки
          }
        );
      })
      break;
    default:
      return null
  }
})

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
      console.log(mainStore.YandexMap.myMap.geoObjects);
    });
  }
  componentWillUpdate(){
    console.log('update');
  }
}