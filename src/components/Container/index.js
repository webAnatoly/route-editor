import React from 'react';
import OnePointRow from '../OnePointRow';
import InputPoint from '../InputPoint';
import Drag from '../Drag';

import s from './style.css';
import checkClass from '../OnePointRow/style.css'

export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      points: [],
      drag: {on: false, styles: {}, hoverON: false},
      html: ''
    }
    this.handleDragStart = this.handleDragStart.bind(this);
    this.removeEntryPoint = this.removeEntryPoint.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  handleDragStart(e) {
    e.preventDefault();
  }

  removeEntryPoint(id) {
    this.setState((prevState)=>{
      let arr = prevState.points;
      let arrWithoutElement = arr.filter((item, index)=>{
        return index != id;
      });
      return { points: arrWithoutElement}
    })
  }

  handleKeyPress(value) {
    this.setState((prevState) => {
      prevState.points.push(value);
      return {points: prevState.points}
    });
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

    const topForAbsolutePosition = getPosition(event.pageY);
    this.setState({
      drag: { 
        on: true, 
        styles: { position: 'absolute', top: topForAbsolutePosition, height: heightCurrentOnePointRow},
      },
      html: currentOnePointRow.innerHTML
    })

    const handleMouseMove = (event) => {
      const space = getPosition(event.pageY);
      this.setState({
        drag: { on: true, styles: { position: 'absolute', top: space, height: heightCurrentOnePointRow }, hoverON: true },
      });
    }
    // еще надо реализовать обработку быстрого ухода мыши с элемента
    // и автопрокрутку страницы если колво рядов уходит за пределы экрана
    // чтобы не выходил за пределы inputa при перетаскивании
    this.myRef.current.addEventListener('mousemove', handleMouseMove);

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
        const idDelete = currentOnePointRow.id;
        const idInsert = onePointRow.id;
        this.setState((prevState)=>{
          const arr = prevState.points;
          const value = arr.splice(idDelete, 1);
          arr.splice(idInsert, 0, value[0]);
          return({
            points: arr,
            drag: { on: false, styles: {}, hoverON: false },
            html: ''
          })
        });
      } else {
        this.setState({
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
      return <OnePointRow value={point} key={index} id={index} onRemove={this.removeEntryPoint} hoverON={this.state.drag.hoverON}/>
    });
    return (
      <div className={`${s.container}`} onDragStart={this.handleDragStart} onMouseDown={this.handleMouseDown} ref={this.myRef}>
        <InputPoint onHandleKeyPress={this.handleKeyPress.bind(this)} />
          {drag}
          {points}
      </div>
    )
  }
}