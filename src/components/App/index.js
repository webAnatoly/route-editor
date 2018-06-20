import React from 'react';
import YandexMap from '../YandexMap';
import Container from '../Container';
import Alert from '../Alert';
import Block from '../Block';

import Dispatcher from '../../data/appDispatcher'; // TODO: [🐱👀] Неиспользуемый код
import { mainStore } from '../../data/Stores';
import keyMirror from 'fbjs/lib/keyMirror'; // TODO: [🐱👀] Неиспользуемый код, библиотека fbjs не подключена
import s from './style.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: mainStore.showAlert
    }
  }
  render() {
    // TODO: [🐱👀] let вместо const
    let alertComponent = mainStore.showAlert ? <Alert/> : false;
    return(
      <div className={s.app}>
        {alertComponent}
        <Block/>
        <Container/>
        <YandexMap/>
      </div>
    )
  }
  componentDidMount() {
    mainStore.addChangeListener(this.handleUpdateEvent.bind(this));
  }

  componentWillUnmount() {
    // TODO: [🐱👀] Здесь и в других местах
    // Function.prototype.bind вернет новый экземпляр функцци, ее копию
    // removeChangeListener на самом деле ничего не делает, потому
    // что this.handleUpdateEvent.bind(this) !== this.handleUpdateEvent.bind(this)
    // и EventEmitter не сможет найти привязанный через addChangeListener обработчик
    mainStore.removeChangeListener(this.handleUpdateEvent.bind(this));
  }

  handleUpdateEvent() {
    this.setState({showAlert: mainStore.getState('showAlert')});
  }
}