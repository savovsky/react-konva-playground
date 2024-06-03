/* eslint-disable react/no-array-index-key */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { ComponentProps, useState, useRef, forwardRef } from 'react';
import { Stage, Layer, Line, Circle, Image, Rect } from 'react-konva';
import useImage from 'use-image';

import {
    PEN,
    ERASER,
    RECT,
    COLOR_ERASER,
    IMG_URL,
    PAINT,
    DEFAULT_COLOR,
} from '../../../../utils/const';

type DrawingItem = {
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
    maskOpacity: number;
    color: string;
    drawings: Array<DrawingItem>;
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
        maskOpacity,
        color,
        drawings,
        handleOnDraw,
        hasCrosshair,
        mode,
    } = props;

    const isDrawing = useRef(false);
    const [image] = useImage(IMG_URL, 'anonymous');
    const offsetFromCanvas = 500;

    const [cursorPosition, setCursorPosition] = useState<PositionType>({
        x: -offsetFromCanvas,
        y: -offsetFromCanvas,
    });

    const handleMouseDown = (e: unknown) => {
        isDrawing.current = true;
        // @ts-ignore
        const point = e.target.getStage().getPointerPosition();

        if (tool === PEN || tool === ERASER) {
            handleOnDraw([
                ...drawings,
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
        }

        if (tool === RECT) {
            handleOnDraw([
                ...drawings,
                {
                    tool,
                    points: [point.x / scale, point.y / scale],
                    size: 0,
                    color,
                },
            ]);
        }
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

        if (tool === PEN || tool === ERASER) {
            const lastDrawing = drawings[drawings.length - 1];
            // add point
            lastDrawing.points = lastDrawing.points.concat([
                point.x / scale,
                point.y / scale,
            ]);

            // replace last
            drawings.splice(drawings.length - 1, 1, lastDrawing);
            handleOnDraw(drawings.concat());
        }

        if (tool === RECT) {
            const lastDrawing = drawings[drawings.length - 1];
            // add point
            lastDrawing.points = lastDrawing.points.concat([
                point.x / scale,
                point.y / scale,
            ]);

            // replace last
            drawings.splice(drawings.length - 1, 1, lastDrawing);
            handleOnDraw(drawings.concat());
        }
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
                {/* Drawings from PEN (free line) */}
                {drawings
                    .filter(
                        (item: DrawingItem) =>
                            item.tool === PEN || item.tool === ERASER,
                    )
                    .map((item: DrawingItem, index: number) => (
                        <Line
                            key={index}
                            points={item.points}
                            stroke={mode === PAINT ? item.color : DEFAULT_COLOR}
                            strokeWidth={item.size}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                item.tool === ERASER
                                    ? 'destination-out'
                                    : 'source-over'
                            }
                        />
                    ))}

                {/* Drawings from RECTANGLE */}
                {drawings
                    .filter((item: DrawingItem) => item.tool === RECT)
                    .map((item: DrawingItem, index: number) => (
                        <Rect
                            key={index}
                            x={item.points[0]}
                            y={item.points[1]}
                            width={
                                item.points[item.points.length - 2] -
                                item.points[0]
                            }
                            height={
                                item.points[item.points.length - 1] -
                                item.points[1]
                            }
                            fill={item.color}
                            globalCompositeOperation={
                                item.tool === ERASER
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
                        opacity={maskOpacity + 0.3}
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
