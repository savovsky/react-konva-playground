/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useRef } from 'react';
import { Stage, Layer, Line, Circle, Group } from 'react-konva';

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
    scale: number;
    tool: string;
    sizePen: number;
    sizeEraser: number;
    lines: Array<LineType>;
    handleOnDraw: Function;
    hasCrosshair: boolean;
};

function CanvasContainer({
    width,
    height,
    scale,
    tool,
    sizePen,
    sizeEraser,
    lines,
    handleOnDraw,
    hasCrosshair,
}: Props) {
    const isDrawing = useRef(false);

    const [cursorPosition, setCursorPosition] = useState<PositionType>({
        x: -100,
        y: -100,
    });

    const handleMouseDown = (e: unknown) => {
        isDrawing.current = true;
        // @ts-ignore
        const point = e.target.getStage().getPointerPosition();

        handleOnDraw([
            ...lines,
            {
                tool,
                points: [
                    point.x / scale,
                    point.y / scale,
                    // alows to draw/erase with one click
                    (point.x - 0.01) / scale,
                    (point.y - 0.01) / scale,
                ],
                size: tool === ERASER ? sizeEraser : sizePen,
            },
        ]);
    };

    const handleMouseMove = (e: unknown) => {
        // @ts-ignore
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        setCursorPosition({ x: point.x / scale, y: point.y / scale });

        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const lastLine = lines[lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([
            point.x / scale,
            point.y / scale,
        ]);

        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        handleOnDraw(lines.concat());
    };
    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const handleMouseLeave = () => {
        setCursorPosition({ x: -100, y: -100 });
    };

    return (
        <Stage
            width={width}
            height={height}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            scale={{ x: scale, y: scale }}
        >
            <Layer>
                {lines.map((line, i) => (
                    <Line
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        points={line.points}
                        stroke={COLOR_PEN}
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
                {hasCrosshair && (
                    <Group>
                        <Line
                            points={[
                                cursorPosition.x,
                                -100,
                                cursorPosition.x,
                                height + 100,
                            ]}
                            stroke={COLOR_PEN}
                            strokeWidth={0.3}
                        />
                        <Line
                            points={[
                                -100,
                                cursorPosition.y,
                                width + 100,
                                cursorPosition.y,
                            ]}
                            stroke={COLOR_PEN}
                            strokeWidth={0.3}
                        />
                    </Group>
                )}
            </Layer>
        </Stage>
    );
}

export default CanvasContainer;
