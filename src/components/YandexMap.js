import React from 'react';

export default class YandexMap extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    const ymaps = this.props.ymaps;
    let moscow_map,
      piter_map;

    ymaps.ready(function () {
      moscow_map = new ymaps.Map("first_map", {
        center: [55.76, 37.64],
        zoom: 10
      });
      piter_map = new ymaps.Map(document.getElementsByTagName('p')[2], {
        center: [59.94, 30.32],
        zoom: 9
      });
    });
    return(
      <div>
        <p>Карта Москвы</p>
        <div id="first_map" style={{width:'400px', height:'300px'}}></div>
        <p>Карта Санкт-Петербурга</p>
        <p style={{ width: '400px', height: '200px' }}></p>
      </div>
    )
  }
}