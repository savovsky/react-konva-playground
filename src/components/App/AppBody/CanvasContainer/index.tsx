/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { ComponentProps, useState, useRef, forwardRef } from 'react';
import { Stage, Layer, Line, Circle, Image } from 'react-konva';
import useImage from 'use-image';

import {
    CANVAS_OPACITY,
    PEN,
    ERASER,
    COLOR_ERASER,
    IMG_URL,
    PAINT,
} from '../../../../utils/const';

type LineType = {
    tool: string;
    points: number[];
    size: number;
    color: string;
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
    color: string;
    lines: Array<LineType>;
    handleOnDraw: Function;
    hasCrosshair: boolean;
    mode: string;
};

type Ref = ComponentProps<typeof Stage>['ref'];

const CanvasContainer = forwardRef((props: Props, canvasStageRef: Ref) => {
    const {
        width,
        height,
        scale,
        tool,
        sizePen,
        sizeEraser,
        color,
        lines,
        handleOnDraw,
        hasCrosshair,
        mode,
    } = props;

    const isDrawing = useRef(false);
    const [image] = useImage(IMG_URL, 'anonymous');
    const offsetFromCanvas = 100;

    const [cursorPosition, setCursorPosition] = useState<PositionType>({
        x: -offsetFromCanvas,
        y: -offsetFromCanvas,
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
                color,
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
        setCursorPosition({ x: -offsetFromCanvas, y: -offsetFromCanvas });
    };

    return (
        <Stage
            ref={canvasStageRef}
            width={width}
            height={height}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            scale={{ x: scale, y: scale }}
        >
            {/* The order of the layers is the order of zIndex-es of the layers */}
            <Layer>
                {mode === PAINT && (
                    <Image
                        image={image}
                        width={width}
                        height={height}
                        scale={{ x: 1 / scale, y: 1 / scale }}
                    />
                )}
            </Layer>

            <Layer>
                {/* Drawing from PEN (free line) */}
                {lines.map((line, i) => (
                    <Line
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        points={line.points}
                        stroke={line.color}
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
                {/* Pointer for PEN (free line) and ERASER */}
                {(tool === PEN || tool === ERASER) && (
                    <Circle
                        x={cursorPosition.x}
                        y={cursorPosition.y}
                        radius={tool === PEN ? sizePen / 2 : sizeEraser / 2}
                        fill={tool === ERASER ? COLOR_ERASER : color}
                        opacity={CANVAS_OPACITY + 0.3}
                        stroke="black"
                        strokeWidth={mode === PAINT ? 0.3 / scale : 0}
                    />
                )}

                {/* Crosshair */}
                {hasCrosshair && (
                    <>
                        <Line
                            points={[
                                cursorPosition.x,
                                -offsetFromCanvas,
                                cursorPosition.x,
                                height + offsetFromCanvas,
                            ]}
                            stroke={tool === ERASER ? COLOR_ERASER : color}
                            strokeWidth={0.5 / scale}
                        />
                        <Line
                            points={[
                                -offsetFromCanvas,
                                cursorPosition.y,
                                width + offsetFromCanvas,
                                cursorPosition.y,
                            ]}
                            stroke={tool === ERASER ? COLOR_ERASER : color}
                            strokeWidth={0.5 / scale}
                        />
                    </>
                )}
            </Layer>
        </Stage>
    );
});

export default CanvasContainer;
