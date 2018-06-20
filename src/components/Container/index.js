import React from 'react';
import OnePointRow from '../OnePointRow';
import InputPoint from '../InputPoint';
import Drag from '../Drag';
import s from './style.css';
import checkClass from '../OnePointRow/style.css';

import {mainStore} from '../../data/Stores';
import Dispatcher from '../../data/appDispatcher';
import keyMirror from 'fbjs/lib/keyMirror';
import updatePointsAndLinesOnMap from '../YandexMap/updatePointAndLinesOnMap';

// TODO: [🐱👀] Здесь и в других местах было бы лучше держать actions в отдельном файле
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
      if (action.condition === 'sameRow') { // если отпустили мышку над тем же элементом
        mainStore.Container.drag = action.drag;
        mainStore.Container.html = action.html;
        mainStore.setState('Container', mainStore.Container);
        break;
      }
      if (action.condition === 'anotherRow') {
        // меняем местами элементы массива в котором хранятся введенные пользователем названия точек
        const value = action.arrPoints.splice(action.idDelete, 1);
        action.arrPoints.splice(action.idInsert, 0, value[0]);

        // меняем местами элементы массива в котором хранятся координаты соответствующие точкам
        const coordsForMoving = mainStore.YandexMap.coordsArr.splice(action.idDelete, 1);
        mainStore.YandexMap.coordsArr.splice(action.idInsert, 0, coordsForMoving[0])

        // Обновляем точки, линии
        updatePointsAndLinesOnMap();
      
        mainStore.setState('Container', {
          points: action.arrPoints,
          drag: { on: false, styles: {} },
          html: ''
        });
        break;
      }
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

  // TODO: [🐱👀] Реализация драг-дропа. Можно заменить на готовую библиотеку
  // https://github.com/react-dnd/react-dnd
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

    const inputElementHeight = this.myRef.current.querySelector('#InputPoint').getBoundingClientRect().height;
    const topBorder = containerPositionY + inputElementHeight;

    const topForAbsolutePosition = getPosition(event.pageY);

    Dispatcher.dispatch({
      type: 'DRAG_START',
      drag: {
        on: true,
        styles: { position: 'absolute', top: topForAbsolutePosition, height: heightCurrentOnePointRow }
      },
      html: currentOnePointRow.innerHTML
    })

    const handleMouseMove = (event) => {
      let space = getPosition(event.pageY);
      if (event.pageY - cursorDifference < topBorder) {
        space = inputElementHeight;
      }
      Dispatcher.dispatch({
        type: 'DRAG_MOUSE_MOVE',
        drag: { on: true, styles: { position: 'absolute', top: space, height: heightCurrentOnePointRow } }
      })
      // еще надо реализовать обработку быстрого ухода мыши с элемента
      // и автопрокрутку страницы если колво рядов уходит за пределы экрана
      // чтобы не выходил за пределы inputa при перетаскивании
    }
    document.documentElement.addEventListener('mousemove', handleMouseMove);

    const handleMouseUp = (event) => {
      // удаляем обработчики
      document.documentElement.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseup', handleMouseUp);

      // находим компонент OnePointRow
      let target = event.target;
      while (target.tagName !== 'HTML') {
        if(target.dataset.about === 'OnePointRow') {
          break;
        }
        target = target.parentElement;
      }
      let onePointRow = target;

      // mouseup случился над любым из элементов OnePointRow
      if (onePointRow.dataset.about === 'OnePointRow') { 
        // mouseup на том же элементе, что и mousedown
        if (currentOnePointRow.id === onePointRow.id) { 
          Dispatcher.dispatch({
            type: 'MOUSE_UP_DROP',
            condition: 'sameRow',
            drag: { on: false, styles: {} },
            html: ''
          })
        } else { // mouseup над любым другим элементом OnePointRow
          // your code here
          Dispatcher.dispatch({
            type: 'MOUSE_UP_DROP',
            condition: 'anotherRow',
            idDelete: currentOnePointRow.id,
            idInsert: onePointRow.id,
            arrPoints: this.state.points
          })
        }
      } else { // mouseup случился где угодно, но НЕ над элементом OnePointRow
        let idInsert;
        // понять находился ли курсор напротив одного из элемента OnePointRow по горизонатльной линии X
        const [x, y] = [this.myRef.current.getBoundingClientRect().left + (this.myRef.current.getBoundingClientRect().width / 2), event.pageY]
        let elem = document.elementFromPoint(x, y);

        if (elem) {
          while (elem.tagName !== 'HTML') {
            if (elem.dataset.about === 'OnePointRow') {
              break;
            }
            elem = elem.parentElement;
            if (elem && elem.dataset.about === 'OnePointRow') {
              idInsert = elem.id
            } else {
              idInsert = event.pageY < topBorder ? 0 : this.state.points.length - 1;
            }
          }
        } else {
          idInsert = event.pageY < topBorder ? 0 : this.state.points.length - 1;
        }
        Dispatcher.dispatch({
          type: 'MOUSE_UP_DROP',
          condition: 'anotherRow',
          idDelete: currentOnePointRow.id,
          idInsert: idInsert,
          arrPoints: this.state.points
        })
      }
    }
    document.documentElement.addEventListener('mouseup', handleMouseUp);
  }

  render() {
    let drag;
    if (this.state.drag.on) {
      drag = <Drag styles={this.state.drag.styles} html={this.state.html}/>;
    }
    const points = this.state.points.map((point, index)=>{
      // TODO: [🐱👀] key={index} приведет к побочным эффектам
      // https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318
      return <OnePointRow value={point} key={index} id={index} />
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
    // TODO: [🐱👀] Ненужный комментарий
    // console.log('mouse click', this.state.drag);
  }

}