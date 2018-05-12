import React from 'react';
import YandexMap from '../YandexMap';
import Container from '../Container';
import Alert from '../Alert';

import Dispatcher from '../../data/appDispatcher';
import { mainStore } from '../../data/Stores';
import keyMirror from 'fbjs/lib/keyMirror';
import s from './style.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: mainStore.showAlert
    }
  }
  render() {
    let alertComponent = mainStore.showAlert ? <Alert/> : false;
    return(
      <div className={s.app}>
        {alertComponent}
        <Container/>
        <YandexMap/>
      </div>
    )
  }
  componentDidMount() {
    mainStore.addChangeListener(this.handleUpdateEvent.bind(this));
  }

  componentWillUnmount() {
    mainStore.removeChangeListener(this.handleUpdateEvent.bind(this));
  }

  handleUpdateEvent() {
    this.setState({showAlert: mainStore.getState('showAlert')});
  }
}