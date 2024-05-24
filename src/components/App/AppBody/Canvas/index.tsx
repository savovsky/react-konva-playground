import React, { useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';

import Field from './Layers/Field';
import RectShape from '../../../Shapes/RectShape';
import CircleShape from '../../../Shapes/CircleShape';

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
                // setHeight(container.offsetHeight);
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    return (
        <div className="canvas-container" data-testid="canvas-container">
            <Stage width={width} height={1000} className="canvas">
                <Layer>
                    <Field />
                </Layer>
                <Layer>
                    <RectShape />
                    <CircleShape />
                </Layer>
            </Stage>
        </div>
    );
}

export default Canvas;
