import { createContext } from 'react';

export const UserContext = createContext({user:null, setUser:(E:any) => {}
});

export const SnackBarContext = createContext({frameSnackbarMessage:null, setFrameSnackbarMessage:(E:any) => {}
});
