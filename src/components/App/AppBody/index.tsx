/* eslint-disable no-console */

import React, { ComponentProps, useState, useRef } from 'react';
import { Box } from '@mui/material';
import { Stage } from 'react-konva';

import Tools from './Tools';
import CanvasContainer from './CanvasContainer';
import useElementSize from '../../../customHooks/useElementSize';
import { transformImageToMask } from '../../../utils/imageUtils';

import {
    PEN,
    RECT,
    ERASER,
    DEFAULT_MODE,
    DEFAULT_TOOL,
    DEFAULT_SIZE_PEN,
    DEFAULT_SIZE_ERASER,
    DEFAULT_IS_DRAWING_HIDDEN,
    CANVAS_OPACITY,
    COLOR_PEN,
    INPAINT,
    PAINT,
} from '../../../utils/const';

type LineType = {
    tool: string;
    points: number[];
    size: number;
};

function AppBody() {
    const canvasParentRef = useRef(null);
    const canvasStageRef: ComponentProps<typeof Stage>['ref'] = useRef(null);
    const { width } = useElementSize(canvasParentRef);
    const [mode, setMode] = useState<string>(DEFAULT_MODE);
    const [tool, setTool] = useState<string>(DEFAULT_TOOL);
    const [sizePen, setSizePen] = useState<number>(DEFAULT_SIZE_PEN);
    const [sizeEraser, setSizeEraser] = useState<number>(DEFAULT_SIZE_ERASER);
    const [isInpaintMode, setIsInpaintMode] = useState<boolean>(true);
    const [hasCrosshair, setHasCrosshair] = useState<boolean>(false);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
    const [color, setColor] = useState<string>(COLOR_PEN);
    const [isDrawingHidden, setIsDrawingHidden] = useState<boolean>(
        DEFAULT_IS_DRAWING_HIDDEN,
    );

    // source image dimensions (use retrieveImageDimensions)
    const sceneWidth = 520;
    const sceneHeight = 435;

    const imageSrc =
        'https://cdn-api-develop.arcanadevs.com/prompt_images/2024/05/30/09/7656-1-1717062024.png';

    const [lines, setLines] = useState<Array<LineType>>([]);

    const handleOnChangeMode = (id: string) => {
        setMode(id);
    };

    const handleOnChangeTool = (id: string) => {
        setTool(id);

        if (id === RECT) {
            setHasCrosshair(true);
        }
    };

    const handleOnChangeSize = (value: number) => {
        if (tool === PEN) {
            setSizePen(value);
        }

        if (tool === ERASER) {
            setSizeEraser(value);
        }
    };

    const handleOnClickClear = () => {
        setLines([]);
        setTool(PEN);
    };

    const handleOnClickUndo = () => {
        if (lines.length === 1) {
            setTool(PEN);
        }

        setLines(lines.slice(0, -1));
    };

    const handleOnChangeIsDrawingHidden = () => {
        setIsDrawingHidden(!isDrawingHidden);
    };

    const handleOnClickToggleMode = () => {
        if (isInpaintMode) {
            // Resseting the state
            setLines([]);
            setTool(DEFAULT_TOOL);
            setSizePen(DEFAULT_SIZE_PEN);
            setSizeEraser(DEFAULT_SIZE_ERASER);
            setIsDrawingHidden(DEFAULT_IS_DRAWING_HIDDEN);
        }

        setIsInpaintMode(!isInpaintMode);
    };

    const handleOnChangeHasCrosshair = () => {
        setHasCrosshair(!hasCrosshair);
    };

    const handleOnClickColorPicker = () => {
        setIsColorPickerOpen(true);
    };

    const handleOnClickAwayColorPicker = () => {
        setIsColorPickerOpen(false);
    };

    const handleOnColorChange = (selectedColor: { hex: string }) => {
        console.log(selectedColor);
        setColor(selectedColor.hex);
        setIsColorPickerOpen(false);
    };

    const handleOnClickLogBase64 = async () => {
        if (canvasStageRef.current) {
            const stage = canvasStageRef.current;

            // The default 'mimeType' is  'image/png'
            const imageBase64 = stage.toDataURL({
                pixelRatio: sceneWidth / stage.width(),
            });

            if (mode === INPAINT) {
                // The default 'mimeType' is  'image/png'
                // It is crucial for the 'transformImageToMask' logic
                // No backgound - only drawing
                const image = await stage.toImage({
                    pixelRatio: sceneWidth / stage.width(),
                });

                const maskBase64 = await transformImageToMask(
                    image as HTMLImageElement,
                    sceneWidth,
                    sceneHeight,
                );

                console.log(maskBase64);
            }

            if (mode === PAINT) {
                console.log(imageBase64);
            }
        }
    };

    const handleOnDraw = (items: Array<LineType>) => {
        setLines(items);
    };

    return (
        <main className="app-body" data-testid="app-body">
            <Tools
                mode={mode}
                tool={tool}
                size={tool === PEN ? sizePen : sizeEraser}
                isDrawingHidden={isDrawingHidden}
                hasDrawing={!!lines.length}
                isInpaintMode={isInpaintMode}
                hasCrosshair={hasCrosshair}
                isColorPickerOpen={isColorPickerOpen}
                color={color}
                handleOnChangeMode={handleOnChangeMode}
                handleOnChangeTool={handleOnChangeTool}
                handleOnClickClear={handleOnClickClear}
                handleOnClickUndo={handleOnClickUndo}
                handleOnChangeSize={handleOnChangeSize}
                handleOnChangeIsDrawingHidden={handleOnChangeIsDrawingHidden}
                handleOnClickToggleMode={handleOnClickToggleMode}
                handleOnChangeHasCrosshair={handleOnChangeHasCrosshair}
                handleOnClickLogBase64={handleOnClickLogBase64}
                handleOnClickColorPicker={handleOnClickColorPicker}
                handleOnColorChange={handleOnColorChange}
                handleOnClickAwayColorPicker={handleOnClickAwayColorPicker}
            />
            {isInpaintMode && (
                <div className="canvas-containers-wrapper">
                    <Box
                        sx={{
                            cursor: isDrawingHidden ? 'default' : 'none',
                            backgroundImage: `url(${imageSrc})`,
                            backgroundSize: 'cover',
                            width: sceneWidth,
                            height: sceneHeight,
                            margin: '0 15px 0 0',
                            canvas: {
                                // Layer - Line (the mask === the drawing)
                                '&:nth-of-type(1)': {
                                    opacity: CANVAS_OPACITY,
                                },
                            },
                        }}
                    >
                        {!isDrawingHidden && (
                            <CanvasContainer
                                width={sceneWidth}
                                height={sceneHeight}
                                scale={1}
                                tool={tool}
                                sizePen={sizePen}
                                sizeEraser={sizeEraser}
                                color={color}
                                lines={lines}
                                handleOnDraw={handleOnDraw}
                                hasCrosshair={hasCrosshair}
                                ref={canvasStageRef}
                            />
                        )}
                    </Box>
                    <Box
                        ref={canvasParentRef}
                        sx={{
                            flex: 1,
                            cursor: isDrawingHidden ? 'default' : 'none',
                            backgroundImage: `url(${imageSrc})`,
                            backgroundSize: 'cover',
                            width,
                            height: sceneHeight * (width / sceneWidth),
                            overflowY: 'auto',
                            canvas: {
                                // Layer - Line (the mask === the drawing)
                                '&:nth-of-type(1)': {
                                    opacity: CANVAS_OPACITY,
                                },
                            },
                        }}
                    >
                        {!isDrawingHidden && (
                            <CanvasContainer
                                width={width}
                                height={sceneHeight * (width / sceneWidth)}
                                scale={width / sceneWidth}
                                tool={tool}
                                sizePen={sizePen}
                                sizeEraser={sizeEraser}
                                color={color}
                                lines={lines}
                                handleOnDraw={handleOnDraw}
                                hasCrosshair={hasCrosshair}
                                ref={canvasStageRef}
                            />
                        )}
                    </Box>
                </div>
            )}
        </main>
    );
}

export default AppBody;
