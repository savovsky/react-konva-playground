/* eslint-disable no-console */

import React, { ComponentProps, useState, useRef } from 'react';
import { Box, Fade, Button } from '@mui/material';
import { Stage } from 'react-konva';

import Tools from './Tools';
import CanvasContainer from './CanvasContainer';
import useElementSize from '../../../customHooks/useElementSize';
import { transformImageToMask } from '../../../utils/imageUtils';

import {
    IMG_URL,
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

type DrawingItem = {
    tool: string;
    points: number[];
    size: number; // TODO rename to strokeWidth ?!
    color: string;
};

function AppBody() {
    const canvasParentRef = useRef(null);
    const canvasStageRef: ComponentProps<typeof Stage>['ref'] = useRef(null);
    const { width } = useElementSize(canvasParentRef);
    const [mode, setMode] = useState<string>(DEFAULT_MODE);
    const [tool, setTool] = useState<string>(DEFAULT_TOOL);
    const [sizePen, setSizePen] = useState<number>(DEFAULT_SIZE_PEN);
    const [sizeEraser, setSizeEraser] = useState<number>(DEFAULT_SIZE_ERASER);
    const [isToolsActive, setIsToolsActive] = useState<boolean>(false);
    const [hasCrosshair, setHasCrosshair] = useState<boolean>(false);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
    const [color, setColor] = useState<string>(COLOR_PEN);
    const [isDrawingHidden, setIsDrawingHidden] = useState<boolean>(
        DEFAULT_IS_DRAWING_HIDDEN,
    );

    // source image dimensions (use retrieveImageDimensions)
    const sceneWidth = 520;
    const sceneHeight = 432;

    const [drawings, setDrawings] = useState<Array<DrawingItem>>([]);

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
        setDrawings([]);
        setTool(PEN);
    };

    const handleOnClickUndo = () => {
        if (drawings.length === 1) {
            setTool(PEN);
        }

        setDrawings(drawings.slice(0, -1));
    };

    const handleOnChangeIsDrawingHidden = () => {
        setIsDrawingHidden(!isDrawingHidden);
    };

    const handleOnClickToggleMode = () => {
        if (isToolsActive) {
            // Resseting the state
            setDrawings([]);
            setTool(DEFAULT_TOOL);
            setSizePen(DEFAULT_SIZE_PEN);
            setSizeEraser(DEFAULT_SIZE_ERASER);
            setIsDrawingHidden(DEFAULT_IS_DRAWING_HIDDEN);
        }

        setIsToolsActive(!isToolsActive);
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
        // console.log(selectedColor);
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

    const handleOnDraw = (items: Array<DrawingItem>) => {
        setDrawings(items);
    };

    return (
        <main className="app-body" data-testid="app-body">
            {!isToolsActive && (
                <Box sx={{ height: '110px' }}>
                    <Button
                        variant="contained"
                        onClick={handleOnClickToggleMode}
                    >
                        {isToolsActive ? 'exit' : 'draw'}
                    </Button>
                </Box>
            )}
            <Fade in={isToolsActive} timeout={500}>
                <Box>
                    {isToolsActive && (
                        <Tools
                            mode={mode}
                            tool={tool}
                            size={tool === PEN ? sizePen : sizeEraser}
                            isDrawingHidden={isDrawingHidden}
                            hasDrawing={!!drawings.length}
                            hasCrosshair={hasCrosshair}
                            isColorPickerOpen={isColorPickerOpen}
                            color={color}
                            handleOnChangeMode={handleOnChangeMode}
                            handleOnChangeTool={handleOnChangeTool}
                            handleOnClickClear={handleOnClickClear}
                            handleOnClickUndo={handleOnClickUndo}
                            handleOnChangeSize={handleOnChangeSize}
                            handleOnChangeIsDrawingHidden={
                                handleOnChangeIsDrawingHidden
                            }
                            handleOnClickToggleMode={handleOnClickToggleMode}
                            handleOnChangeHasCrosshair={
                                handleOnChangeHasCrosshair
                            }
                            handleOnClickLogBase64={handleOnClickLogBase64}
                            handleOnClickColorPicker={handleOnClickColorPicker}
                            handleOnColorChange={handleOnColorChange}
                            handleOnClickAwayColorPicker={
                                handleOnClickAwayColorPicker
                            }
                        />
                    )}
                </Box>
            </Fade>

            <div className="canvas-containers-wrapper">
                <Box
                    sx={{
                        cursor:
                            !isToolsActive || isDrawingHidden
                                ? 'default'
                                : 'none',
                        backgroundImage: `url(${IMG_URL})`,
                        backgroundSize: 'cover',
                        width: sceneWidth,
                        height: sceneHeight,
                        margin: '0 15px 0 0',
                        canvas: {
                            // Layer - Drawing from PEN (free line)
                            '&:nth-of-type(2)': {
                                opacity: mode === INPAINT ? CANVAS_OPACITY : 1,
                            },
                        },
                    }}
                >
                    {isToolsActive && !isDrawingHidden && (
                        <CanvasContainer
                            width={sceneWidth}
                            height={sceneHeight}
                            scale={1}
                            tool={tool}
                            sizePen={sizePen}
                            sizeEraser={sizeEraser}
                            color={color}
                            drawings={drawings}
                            handleOnDraw={handleOnDraw}
                            hasCrosshair={hasCrosshair}
                            mode={mode}
                            ref={canvasStageRef}
                        />
                    )}
                </Box>
                <Box
                    ref={canvasParentRef}
                    sx={{
                        flex: 1,
                        cursor:
                            !isToolsActive || isDrawingHidden
                                ? 'default'
                                : 'none',
                        backgroundImage: `url(${IMG_URL})`,
                        backgroundSize: 'cover',
                        width,
                        height: sceneHeight * (width / sceneWidth),
                        overflowY: 'auto',
                        canvas: {
                            // Layer - Drawing from PEN (free line)
                            '&:nth-of-type(2)': {
                                opacity: mode === INPAINT ? CANVAS_OPACITY : 1,
                            },
                        },
                    }}
                >
                    {isToolsActive && !isDrawingHidden && (
                        <CanvasContainer
                            width={width}
                            height={sceneHeight * (width / sceneWidth)}
                            scale={width / sceneWidth}
                            tool={tool}
                            sizePen={sizePen}
                            sizeEraser={sizeEraser}
                            color={color}
                            drawings={drawings}
                            handleOnDraw={handleOnDraw}
                            hasCrosshair={hasCrosshair}
                            mode={mode}
                            ref={canvasStageRef}
                        />
                    )}
                </Box>
            </div>
        </main>
    );
}

export default AppBody;
