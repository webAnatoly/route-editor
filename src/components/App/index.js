import React from 'react';
import YandexMap from '../YandexMap';
import Container from '../Container';
import Button from '../Button';
import MinusButton from '../MinusButton';
import Message from '../Message';

import Dispatcher from '../../data/appDispatcher';
import { mainStore } from '../../data/Stores';
import keyMirror from 'fbjs/lib/keyMirror';
import s from './style.css';

export default class App extends React.Component {
  render() {
    return(
      <div className={s.app}>
        <Container/>
        <YandexMap/>
      </div>
    )
  }
}