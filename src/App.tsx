import React, { createContext, useContext, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { UserContext, SnackBarContext } from './Context';
import { AppFrame } from './appFrame';
import { AppRoute } from './appRoute';

interface IUser{
  email: string;
  password: string;
  role: string;
}

function App() {
  // const [user, setUser] = useState<any | null>(JSON.parse(localStorage.user));
  const [user, setUser] = useState<any | null>(localStorage.user);
  const userValue = {
    user,setUser
  }

  const [frameSnackbarMessage, setFrameSnackbarMessage] = useState<any | null>('');
  const frameSnackbarValue = {
    frameSnackbarMessage, setFrameSnackbarMessage
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      setIsLoggedIn(user?true:false);
  }, [user])

  useEffect(() => {
      setIsLoggedIn(user?true:false);
  }, [])
  
  return (
      <div className="App">
        <BrowserRouter> 

          <UserContext.Provider value={userValue}>
            <SnackBarContext.Provider value={frameSnackbarValue}>
              <AppFrame isAuthenticated = {isLoggedIn}>
                <AppRoute />
              </AppFrame>
            </SnackBarContext.Provider>
          </UserContext.Provider>

        </BrowserRouter>
      </div>
  );
}

export default App;
