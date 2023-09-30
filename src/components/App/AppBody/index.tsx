import React from 'react';

import Tools from './Tools';
import Canvas from './Canvas';

function AppBody() {
    return (
        <main className="app-body" data-testid="app-body">
            <Tools />
            <Canvas />
        </main>
    );
}

export default AppBody;
