import React, { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { ColorModeContext, useMode } from "./theme";
import Sidebar from './core/Sidebar';
import Topbar from './core/Topbar';
import Team from './features/team';

// Define the context and its types

interface AppProps {
  children?: ReactNode;
}

const App: React.FC<AppProps> = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar></Sidebar>
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<Team />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;