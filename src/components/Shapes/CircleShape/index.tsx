import React, { useState } from 'react';
import { Circle } from 'react-konva';

function CircleShape() {
    const [shadowBlur, setShadowBlur] = useState(0);

    const handleOnMouseDown = () => {
        setShadowBlur(35);
    };

    const handleOnDragEnd = () => {
        setShadowBlur(0);
    };

    return (
        <Circle
            x={80}
            y={30}
            radius={10}
            fill="red"
            stroke="black"
            strokeWidth={1}
            draggable
            shadowBlur={shadowBlur}
            // onClick={handleClick}
            onMouseDown={handleOnMouseDown}
            onDragEnd={handleOnDragEnd}
        />
    );
}

export default CircleShape;
