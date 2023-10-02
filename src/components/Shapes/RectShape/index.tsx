import React, { useState } from 'react';
import { Rect } from 'react-konva';
import Konva from 'konva';

function RectShape() {
    const [color, setColor] = useState('green');
    const [shadowBlur, setShadowBlur] = useState(0);

    const handleClick = () => {
        setColor(Konva.Util.getRandomColor());
    };

    const handleOnMouseDown = () => {
        setShadowBlur(35);
    };

    const handleOnDragEnd = () => {
        setShadowBlur(0);
    };

    return (
        <Rect
            x={10}
            y={10}
            width={30}
            height={30}
            fill={color}
            draggable
            shadowBlur={shadowBlur}
            onClick={handleClick}
            onMouseDown={handleOnMouseDown}
            onDragEnd={handleOnDragEnd}
        />
    );
}

export default RectShape;
