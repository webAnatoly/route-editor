import React from 'react';
import { Map, Marker, MarkerLayout } from 'yandex-map-react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
        <Map onAPIAvailable={() => console.log('API loaded')} center={[55.754734, 37.583314]} zoom={5}>
          <Marker lat={55.75} lon={37.9} />
        </Map>
      </div>
    )
  }
}