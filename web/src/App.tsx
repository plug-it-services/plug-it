import React from 'react';
import logo from './logo.svg';
import './App.css';

import Button from './components/Button';
import AccountTile from './components/AccountTile';
import ServiceCard from './components/ServiceCard';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header title="Plug-it" area="AREAs" />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <br></br>
        <Button color="primary" text="Click me" onClick={() => alert('Hello')} />
        <br></br>
        <Button color="secondary" text="Click me" onClick={() => alert('Hello')} />
        <br></br>
        <AccountTile name="Jean Michel" email="jeanmichel@plugit.org" />
        <br></br>
        <ServiceCard
          img={'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png'}
          title={'Youtube'}
          description={'Youtube is a video sharing platform.'}
          buttonLabel={'Connect'}
          onClick={() => alert('Add')}
        />
        <br></br>
      </header>
    </div>
  );
}

export default App;
