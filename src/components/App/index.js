import React from 'react';
import YandexMap from '../YandexMap';
import Container from '../Container';
import s from './style.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div className={s.app}>
        <Container/>
        <YandexMap/>
      </div>
    )
  }
}