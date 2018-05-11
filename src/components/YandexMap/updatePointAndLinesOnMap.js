import {mainStore} from '../../data/Stores';


const updatePointsAndLinesOnMap = () => {

  // Очищаем геоколекцию
  mainStore.YandexMap.myGeoObjectCollectionPoints.removeAll();
  mainStore.YandexMap.myGeoObjectCollectionLines.removeAll();

  // Добавить точки и линии в геоколекцию
  mainStore.YandexMap.myGeoObjectCollectionLines.add(new ymaps.Polyline(mainStore.YandexMap.coordsArr, {}, { draggable: true }));
  mainStore.YandexMap.coordsArr.forEach((coords, index) => {
    mainStore.YandexMap.myGeoObjectCollectionPoints.add(
      new ymaps.GeoObject({
        // Описание геометрии.
        geometry: {
          type: "Point",
          coordinates: coords
        },
        // Свойства.
        properties: {
          // Контент метки.
          iconContent: index + 1,
          hintContent: 'hintContent'
        }
      }, {
          // Опции.
          // Иконка метки будет растягиваться под размер ее содержимого.
          preset: 'islands#blackStretchyIcon',
          // Метку можно перемещать.
          draggable: true
        })
    )
  })
  
}

export default updatePointsAndLinesOnMap;