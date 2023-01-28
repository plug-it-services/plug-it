import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import Button from './components/Button';
import ServiceCard from './components/ServiceCard';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import AreaCard from './components/AreaCard';
import InputBar from './components/InputBar';
import LoginCard from './components/LoginCard';
import TriggerCard from './components/TriggerCard';

import LoginPage from './pages/LoginPage';
import ServicesPage from './pages/ServicesPage';
import AreasPage from './pages/AreasPage';

function App() {
  // Router
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/areas" element={<AreasPage />} />
        </Routes>
      </Router>
    </div>
  );
}

/*
 <Header title="Plug-it" area="AREAs" />
      <header className="App-header">
        <br></br>
        <SearchBar
          onChange={() => {}}
          onSearch={() => {}}
          defaultDummyValue="Search"
          textColor="black"
          backgroundColor="#EAF1FF"
          borderColor="#EAF1FF"
        />
        <br></br>
        <InputBar
          onChange={() => {}}
          defaultDummyValue="Username field :O"
          textColor="black"
          backgroundColor="#EAF1FF"
          borderColor="#EAF1FF"
          isPassword={false}
        />
        <br></br>
        <InputBar
          onChange={() => {}}
          defaultDummyValue="Password field :O"
          textColor="black"
          backgroundColor="#EAF1FF"
          borderColor="#EAF1FF"
          isPassword={true}
        />
        <br></br>
        <LoginCard
          title={'Login'}
          description={'Login to your account.'}
          buttonLabel={'Login'}
          onClick={() => alert('Login')}
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
          iconList={[
            'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png',
            'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png',
            'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png',
          ]}
          buttonLabel={'Disable'}
          onClick={() => alert('Add')}
        />
        <br></br>
        <TriggerCard
          title={'Youtube'}
          subtitle={'Youtube is a video sharing platform.'}
          icon={'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png'}
          backgroundColor={'#2757C9'}
        />
        <br></br>
      </header>
 */

export default App;
