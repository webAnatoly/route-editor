// TODO: [🐱👀] Видимо, этот файл нужно перенести в src/components/InputPoint/index.js

import {mainStore} from '../../data/Stores';
import Dispatcher from '../../data/appDispatcher'; 

function myEventHandler (event){
  const target = event.get('target');
  const newCoordinates = target.geometry.getCoordinates();
  const id = target.properties.get('myId');
  mainStore.YandexMap.coordsArr[id] = newCoordinates;
  // обратное геокодирование из координат в адрес
  mainStore.YandexMap.ymaps.geocode(newCoordinates)
    .then(
      function (res) {
        if (res.geoObjects.get(0) !== null) {
          // пытаюсь получить адрес точки по координатам
          const firstGeoObject = res.geoObjects.get(0);
          
          const adressFromCoords = [
            // Название населенного пункта или вышестоящее административно-территориальное образование.
            firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
            // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
          ].filter(Boolean).join(', ');
          return(adressFromCoords);
        } else {
          console.log('res.geoObjects.get(0) === 0', res.geoObjects.get(0));
        }
      },
      function (err) {
        console.log('ошибка в myGeocoder', err);
        // обработка ошибки
    })
    .then(
      (adress) => {
        // Через Dispatcher обновляю массив mainStore.Container.points, чтобы добиться обновления отображения записей о точках в списке точек
        Dispatcher.dispatch({
          type: 'CHANGE_ENTRY_POINT',
          value: adress,
          id: id
        })
        updatePointsAndLinesOnMap();
      },
      (err) => {
        console.log('ошибка в процессе получения адреса', err)
    });
}
  
function updatePointsAndLinesOnMap(){
  // Очищаем геоколекцию
  mainStore.YandexMap.myGeoObjectCollectionPoints.removeAll();
  mainStore.YandexMap.myGeoObjectCollectionLines.removeAll();

  // Добавить точки и линии в геоколекцию
  mainStore.YandexMap.myGeoObjectCollectionLines.add(new ymaps.Polyline(mainStore.YandexMap.coordsArr, {}, { draggable: true }));
  mainStore.YandexMap.coordsArr.forEach((coords, index) => {
    let point = new ymaps.GeoObject({
      // Описание геометрии.
      geometry: {
        type: "Point",
        coordinates: coords
      },
      // Свойства.
      properties: {
        // Контент метки.
        iconContent: index + 1,
        myId: index,
        // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
        // balloonContentHeader: "Инфо:",
        balloonContentBody: `${mainStore.Container.points[index]}`,
        balloonContentFooter: `${coords.map((coord)=>' ' + coord.toFixed(2))}`,
      }
    }, {
        // Опции.
        // Иконка метки будет растягиваться под размер ее содержимого.
        preset: 'islands#blackStretchyIcon',
        // Метку можно перемещать.
        draggable: true
      })
    point.events.add('dragend', myEventHandler);
    mainStore.YandexMap.myGeoObjectCollectionPoints.add(point);
  })
}

function updateLines(){
  mainStore.YandexMap.myGeoObjectCollectionLines.removeAll();
  mainStore.YandexMap.myGeoObjectCollectionLines.add(new ymaps.Polyline(mainStore.YandexMap.coordsArr, {}, { draggable: true }));
}


export default updatePointsAndLinesOnMap;