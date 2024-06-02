import React from 'react';

import str from '../../../utils/strings';

function AppHeader() {
    return (
        <header className="app-header" data-testid="app-header">
            <h2>{str.appTitle}</h2>
        </header>
    );
}

export default AppHeader;
