import React from 'react';

import AppHeader from './AppHeader';
import AppBody from './AppBody';

function App() {
    return (
        <div className="app-container" data-testid="app-container">
            <AppHeader />
            <AppBody />
        </div>
    );
}

export default App;
