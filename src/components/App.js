import React from 'react';
import YandexMap from './YandexMap';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
        <YandexMap ymaps={this.props.ymaps}/>
      </div>
    )
  }
}