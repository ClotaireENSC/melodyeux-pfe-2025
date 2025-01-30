import React, { createContext, useState } from 'react';

export const ListenMusicContext = createContext();

export const ListenMusicProvider = ({ children }) => {
  const [listenMusic, setListenMusic] = useState(false);

  return (
    <ListenMusicContext.Provider value={{ listenMusic, setListenMusic }}>
      {children}
    </ListenMusicContext.Provider>
  );
};