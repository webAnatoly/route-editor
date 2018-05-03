import React from 'react';
import s from './style.css';
import OnePointRow from '../OnePointRow';
import InputPoint from '../InputPoint';
import Drag from '../Drag';

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
    this.handleKeyUP = this.handleKeyUP.bind(this);
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

  handleKeyUP(event) {
    let value = event.target.value;
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
      if (target.tagName === 'BUTTON') return;
      if (target.tagName === 'INPUT') return;
      target = target.parentElement;
    }
    const currentOnePointRow = target;
    console.log(currentOnePointRow.innerHTML);

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
    this.myRef.current.addEventListener('mousemove', handleMouseMove);

    const handleMouseUp = (event) => {
      this.myRef.current.removeEventListener('mousemove', handleMouseMove);
      this.setState({
        drag: { on: false, styles: {}, hoverON: false },
        html: ''
      })
    }
    this.myRef.current.addEventListener('mouseup', handleMouseUp);
  }

  render() {
    let drag = false;
    if (this.state.drag.on) {
      drag = <Drag styles={this.state.drag.styles} html={this.state.html}/>;
    }
    const points = this.state.points.map((point, index)=>{
      return <OnePointRow value={point} key={index} id={index} onRemove={this.removeEntryPoint} hoverON={this.state.drag.hoverON}/>
    });
    return (
      <div className={`${s.container}`} onDragStart={this.handleDragStart} onMouseDown={this.handleMouseDown} ref={this.myRef}>
        <InputPoint onHandleKeyUP={this.handleKeyUP}/>
        {drag}
        {points}
      </div>
    )
  }
}