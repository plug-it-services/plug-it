import React from 'react';
import logo from './logo.svg';
import './App.css';

import Button from './components/Button';
import ServiceCard from './components/ServiceCard';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import AreaCard  from './components/AreaCard';

function App() {
  return (
    <div className="App">
      <Header title="Plug-it" area="AREAs" />
      <header className="App-header">
        <br></br>
        <SearchBar
          onChange={() => {}}
          onSearch={() => {}}
          defaultDummyValue="Search"
          textColor="black"
          backgroundColor="white"
          borderColor="grey"
        />
        <br></br>
        <Button color="primary" text="Click me" onClick={() => alert('Hello')} />
        <br></br>
        <Button color="secondary" text="Click me" onClick={() => alert('Hello')} />
        <br></br>
        <ServiceCard
          img={'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png'}
          title={'Youtube'}
          description={'Youtube is a video sharing platform.'}
          buttonLabel={'Connect'}
          onClick={() => alert('Add')}
        />
        <br></br>
        <AreaCard
          title={'Youtube'}
          date={'2021-10-10'}
          iconList={['https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png']}
          buttonLabel={'Connect'}
          onClick={() => alert('Add')}
        />
      </header>
    </div>
  );
}

export default App;
