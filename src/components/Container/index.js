import React from 'react';
import OnePointRow from '../OnePointRow';
import InputPoint from '../InputPoint';
import Drag from '../Drag';
import s from './style.css';
import checkClass from '../OnePointRow/style.css';

import {mainStore} from '../../data/Stores';
import Dispatcher from '../../data/appDispatcher';
import keyMirror from 'fbjs/lib/keyMirror';

const actions = keyMirror({
  DRAG_START: null,
  DRAG_MOUSE_MOVE: null,
  MOUSE_UP_DROP: null
})

Dispatcher.register((action)=>{
  switch(action.type){
    case actions.DRAG_START:
      mainStore.Container.drag = action.drag;
      mainStore.Container.html = action.html;
      mainStore.setState('Container', mainStore.Container);
      break;
    case actions.DRAG_MOUSE_MOVE:
      mainStore.Container.drag = action.drag;
      mainStore.setState('Container', mainStore.Container);
      break;
    case actions.MOUSE_UP_DROP:
      if (action.sameRow) { // если отпустили мышку над тем же элементом
        mainStore.Container.drag = action.drag;
        mainStore.Container.html = action.html;
        mainStore.setState('Container', mainStore.Container);
        break;
      }
      const value = action.arrPoints.splice(action.idDelete, 1);
      action.arrPoints.splice(action.idInsert, 0, value[0]);
      mainStore.setState('Container', {
        points: action.arrPoints,
        drag: { on: false, styles: {}, hoverON: false },
        html: ''
      });
      break;
    default:
      return null
  }
})

export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = mainStore.Container;

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  handleDragStart(e) {
    e.preventDefault();
  }

  handleMouseDown(event) {
    // Определяем где было нажатие и если оно было там где не надо, то выходим из обработчика.
    let target = event.target;
    if (target.classList.contains(s.container)) return; // если кликнули непосредственно на самом контейнере, то выходим тоже
    while (target.tagName !== 'DIV') {
      if (target.tagName === 'BUTTON' || target.tagName === 'INPUT') return;
      target = target.parentElement;
    }
    const currentOnePointRow = target;
    if(currentOnePointRow.classList[0] !== checkClass.rowContainer) return; 

    const containerPositionY = this.myRef.current.getBoundingClientRect().top + pageYOffset;
    const cursorDifference = event.pageY - (currentOnePointRow.getBoundingClientRect().top + pageYOffset);
    const heightCurrentOnePointRow = getComputedStyle(currentOnePointRow).height;
    const getPosition = (cursorPosition) => {
      return cursorPosition - containerPositionY - cursorDifference;
    }

    const inputElementHeight = this.myRef.current.querySelector('input').getBoundingClientRect().height;
    console.log('inputElementHeiht', inputElementHeight);

    const topForAbsolutePosition = getPosition(event.pageY);

    Dispatcher.dispatch({
      type: 'DRAG_START',
      drag: {
        on: true,
        styles: { position: 'absolute', top: topForAbsolutePosition, height: heightCurrentOnePointRow },
        hoverON: false,
      },
      html: currentOnePointRow.innerHTML
    })

    const handleMouseMove = (event) => {
      const space = getPosition(event.pageY);
      Dispatcher.dispatch({
        type: 'DRAG_MOUSE_MOVE',
        drag: { on: true, styles: { position: 'absolute', top: space, height: heightCurrentOnePointRow }, hoverON: true }
      })
    }
    // еще надо реализовать обработку быстрого ухода мыши с элемента
    // и автопрокрутку страницы если колво рядов уходит за пределы экрана
    // чтобы не выходил за пределы inputa при перетаскивании
    this.myRef.current.addEventListener('mousemove', handleMouseMove);
    console.log(this.myRef.current);

    const handleMouseUp = (event) => {

      // находим компонент OnePointRow
      let target = event.target;
      while (target.tagName !== 'DIV') {
        target = target.parentElement;
      }
      let onePointRow = target;

      // удаляем обработчики
      this.myRef.current.removeEventListener('mousemove', handleMouseMove);
      this.myRef.current.parentElement.removeEventListener('mouseup', handleMouseUp);

      // меняем положение рядов
      if (currentOnePointRow.id !== onePointRow.id) {
        Dispatcher.dispatch({
          type: 'MOUSE_UP_DROP',
          sameRow: false, 
          idDelete: currentOnePointRow.id,
          idInsert: onePointRow.id,
          arrPoints: this.state.points
        })
      } else { // если mouseup случилось на том же элементе, что и mousedown
        Dispatcher.dispatch({
          type: 'MOUSE_UP_DROP',
          sameRow: true, 
          drag: { on: false, styles: {}, hoverON: false },
          html: ''
        })
      }
    }
    this.myRef.current.parentElement.addEventListener('mouseup', handleMouseUp);
  }

  render() {
    let drag;
    if (this.state.drag.on) {
      drag = <Drag styles={this.state.drag.styles} html={this.state.html}/>;
    }
    const points = this.state.points.map((point, index)=>{
      return <OnePointRow value={point} key={index} id={index} hoverON={this.state.drag.hoverON}/>
    });
    return (
      <div className={`${s.container}`} onDragStart={this.handleDragStart} onMouseDown={this.handleMouseDown} ref={this.myRef}>
        <InputPoint/>
          {drag}
          {points}
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
    this.setState(mainStore.getState('Container'));
  }

  componentDidUpdate(){
    // console.log('mouse click', this.state.drag);
  }

}