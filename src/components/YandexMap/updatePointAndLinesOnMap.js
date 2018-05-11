import {mainStore} from '../../data/Stores';

function myEventHandler (event){
    const newCoordinates = event.get('target').geometry.getCoordinates();
    const id = event.get('target').properties.get('myId');
    mainStore.YandexMap.coordsArr[id] = newCoordinates;
    updatePointsAndLinesOnMap();
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
          hintContent: 'hintContent',
          myId: index
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

export default updatePointsAndLinesOnMap;