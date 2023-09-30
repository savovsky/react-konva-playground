import React from 'react';

import str from '../../../utils/strings';

function AppHeader() {
    return (
        <header className="app-header" data-testid="app-header">
            <h1>{str.appTitle}</h1>
        </header>
    );
}

export default AppHeader;
