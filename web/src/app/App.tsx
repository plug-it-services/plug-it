import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Router from './Router';
import theme from '../theme/Theme';

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </div>
  );
}

export default App;
