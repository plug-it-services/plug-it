import React from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import Router from './Router';
import theme from '../components/Theme';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </div>
  );
}

export default App;
