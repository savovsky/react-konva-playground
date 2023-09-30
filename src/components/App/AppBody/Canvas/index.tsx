import React, { useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';

import Rectangular from '../../../Shapes/Rectangular';

function Canvas() {
    const [width, setWidth] = useState(500);
    // const [height, setHeight] = useState(500);

    useEffect(() => {
        const updateCanvasSize = () => {
            const container = document.querySelector(
                '.canvas-container',
            ) as HTMLElement;

            if (container) {
                setWidth(container.offsetWidth);
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    return (
        <div className="canvas-container" data-testid="canvas-container">
            <Stage width={width} height={500} className="canvas">
                <Layer>
                    <Rectangular />
                </Layer>
            </Stage>
        </div>
    );
}

export default Canvas;
