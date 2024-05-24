/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useRef } from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';
import { Box } from '@mui/material';

import {
    CANVAS_OPACITY,
    PEN,
    ERASER,
    COLOR_PEN,
    COLOR_ERASER,
} from '../../../../utils/const';

type LineType = {
    tool: string;
    points: number[];
    size: number;
};

type PositionType = {
    x: number;
    y: number;
};

type Props = {
    width: number;
    height: number;
    tool: string;
    sizePen: number;
    sizeEraser: number;
    lines: Array<LineType>;
    handleOnDraw: Function;
};

function CanvasContainer({
    width,
    height,
    tool,
    sizePen,
    sizeEraser,
    lines,
    handleOnDraw,
}: Props) {
    const isDrawing = useRef(false);

    const [cursorPosition, setCursorPosition] = useState<PositionType>({
        x: -100,
        y: -100,
    });

    const handleMouseDown = (e: unknown) => {
        isDrawing.current = true;
        // @ts-ignore
        const pos = e.target.getStage().getPointerPosition();

        handleOnDraw([
            ...lines,
            {
                tool,
                points: [
                    pos.x,
                    pos.y,
                    // alows to draw/erase with one click
                    pos.x - 0.01,
                    pos.y - 0.01,
                ],
                size: tool === 'eraser' ? sizeEraser : sizePen,
            },
        ]);
    };

    const handleMouseMove = (e: unknown) => {
        // @ts-ignore
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        setCursorPosition({ x: point.x, y: point.y });

        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const lastLine = lines[lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        handleOnDraw(lines.concat());
    };
    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const handleMouseEnter = () => {};

    const handleMouseLeave = () => {
        setCursorPosition({ x: -100, y: -100 });
    };

    return (
        <Box
            sx={{
                canvas: {
                    // Layer - Line
                    '&:nth-of-type(1)': {
                        opacity: CANVAS_OPACITY,
                    },
                    // Layer - Circle
                    '&:nth-of-type(2)': {
                        opacity: tool === ERASER ? 'initial' : CANVAS_OPACITY,
                    },
                },
                cursor: 'none',
                background: 'grey',
                width,
                height,
            }}
        >
            <Stage
                width={width}
                height={height}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                            points={line.points}
                            stroke="pink"
                            strokeWidth={line.size}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                line.tool === ERASER
                                    ? 'destination-out'
                                    : 'source-over'
                            }
                        />
                    ))}
                </Layer>

                <Layer>
                    <Circle
                        x={cursorPosition.x}
                        y={cursorPosition.y}
                        radius={tool === PEN ? sizePen / 2 : sizeEraser / 2}
                        fill={tool === PEN ? COLOR_PEN : COLOR_ERASER}
                        opacity={tool === PEN ? CANVAS_OPACITY : 1}
                    />
                </Layer>
            </Stage>
        </Box>
    );
}

export default CanvasContainer;
