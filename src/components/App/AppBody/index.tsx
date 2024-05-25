/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from 'react';

import Tools from './Tools';
import CanvasContainer from './CanvasContainer';
import useElementSize from '../../../customHooks/useElementSize';

import {
    PEN,
    DEFAULT_TOOL,
    DEFAULT_SIZE_PEN,
    ERASER,
    DEFAULT_SIZE_ERASER,
    DEFAULT_IS_DRAWING_HIDDEN,
} from '../../../utils/const';

type LineType = {
    tool: string;
    points: number[];
    size: number;
};

function AppBody() {
    const ref = useRef(null);
    const { width, height } = useElementSize(ref);
    const [tool, setTool] = useState<string>(DEFAULT_TOOL);
    const [sizePen, setSizePen] = useState<number>(DEFAULT_SIZE_PEN);
    const [sizeEraser, setSizeEraser] = useState<number>(DEFAULT_SIZE_ERASER);
    const [isInpaintMode, setIsInpaintMode] = useState<boolean>(true);
    const [isDrawingHidden, setIsDrawingHidden] = useState<boolean>(
        DEFAULT_IS_DRAWING_HIDDEN,
    );

    const [lines, setLines] = useState<Array<LineType>>([]);

    const handleOnChangeTool = (id: string) => {
        setTool(id);
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

    const handleOnDraw = (items: Array<LineType>) => {
        setLines(items);
    };

    const sceneWidth = 520;
    const sceneHeight = 435;

    return (
        <main className="app-body" data-testid="app-body">
            <Tools
                tool={tool}
                size={tool === PEN ? sizePen : sizeEraser}
                isDrawingHidden={isDrawingHidden}
                hasDrawing={!!lines.length}
                isInpaintMode={isInpaintMode}
                handleOnChangeTool={handleOnChangeTool}
                handleOnClickClear={handleOnClickClear}
                handleOnClickUndo={handleOnClickUndo}
                handleOnChangeSize={handleOnChangeSize}
                handleOnChangeIsDrawingHidden={handleOnChangeIsDrawingHidden}
                handleOnClickToggleMode={handleOnClickToggleMode}
            />
            {!isDrawingHidden && isInpaintMode && (
                <div className="canvas-containers-wrapper">
                    <div
                        className="stage-hardcoded"
                        style={{ width: sceneWidth, height: sceneHeight }}
                    >
                        <CanvasContainer
                            width={sceneWidth}
                            height={sceneHeight}
                            scale={1}
                            tool={tool}
                            sizePen={sizePen}
                            sizeEraser={sizeEraser}
                            lines={lines}
                            handleOnDraw={handleOnDraw}
                        />
                    </div>
                    <div
                        ref={ref}
                        className="stage-responsive"
                        style={{
                            width,
                            height: sceneHeight * (width / sceneWidth),
                        }}
                    >
                        <CanvasContainer
                            width={width}
                            height={sceneHeight * (width / sceneWidth)}
                            scale={width / sceneWidth}
                            tool={tool}
                            sizePen={sizePen}
                            sizeEraser={sizeEraser}
                            lines={lines}
                            handleOnDraw={handleOnDraw}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}

export default AppBody;
