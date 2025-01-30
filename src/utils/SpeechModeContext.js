import React, { createContext, useState } from 'react';

export const SpeechModeContext = createContext();

export const SpeechModeProvider = ({ children }) => {
    const [speechMode, setSpeechMode] = useState(false);

    return (
        <SpeechModeContext.Provider value={{ speechMode, setSpeechMode }}>
            {children}
        </SpeechModeContext.Provider>
    );
};