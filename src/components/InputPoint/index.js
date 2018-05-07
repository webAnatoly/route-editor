import React from 'react';
import s from './style.css';
import {mainStore} from '../../data/Stores';
import Dispatcher from '../../data/appDispatcher';
import keyMirror from 'fbjs/lib/keyMirror';

const actions = keyMirror({
  ADD_ENTRY_POINT: null,
  DEL_ALL_POINTS: null,
});

Dispatcher.register((action) => {
  switch (action.type) {
    case actions.ADD_ENTRY_POINT:
      mainStore.Container.points.push(action.value);
      mainStore.setState('Container', mainStore.Container); // тут я весь объект переписываю. Наверное лучше будет если менять только одно свойство points. Ну пока так пусть побудет.
      break;
    case actions.DEL_ALL_POINTS:
      mainStore.Container.points = [];
      mainStore.setState('Container', mainStore.Container); // и тут я весь объект переписываю. Наверное лучше будет если менять только одно свойство points. Ну пока так пусть побудет.
      break;
    default:
      return null;
  }
})

export default class InputPoint extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = mainStore.InputPoint;
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      let value = event.target.value;
      Dispatcher.dispatch({
        type: actions.ADD_ENTRY_POINT,
        value: value
      })
      event.target.value = '';
    }
  }

  deleteAllPoints() {
    Dispatcher.dispatch({
      type: actions.DEL_ALL_POINTS
    })
  }

  render() {
    return (
      <label>
        <input type="text" id="InputPoint" className={s.main} defaultValue={''} onKeyPress={this.handleKeyPress.bind(this)} autoFocus ref={this.myRef} />
        <span className={s.delete} onClick={this.deleteAllPoints.bind(this)}>CLEAR</span>
      </label>
    )
  }
}