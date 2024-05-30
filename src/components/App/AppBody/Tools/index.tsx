/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import {
    Box,
    Select,
    MenuItem,
    SelectChangeEvent,
    Button,
    Slider,
    FormControlLabel,
    Switch,
    Checkbox,
} from '@mui/material';

import { PEN, ERASER } from '../../../../utils/const';

type Props = {
    tool: string;
    size: number;
    isDrawingHidden: boolean;
    hasDrawing: boolean;
    isInpaintMode: boolean;
    hasCrosshair: boolean;
    handleOnChangeTool: Function;
    handleOnClickClear: Function;
    handleOnClickUndo: Function;
    handleOnChangeSize: Function;
    handleOnChangeIsDrawingHidden: Function;
    handleOnClickToggleMode: Function;
    handleOnChangeHasCrosshair: Function;
};

function Tools({
    tool,
    size,
    isDrawingHidden,
    hasDrawing,
    isInpaintMode,
    hasCrosshair,
    handleOnChangeTool,
    handleOnClickClear,
    handleOnClickUndo,
    handleOnChangeSize,
    handleOnChangeIsDrawingHidden,
    handleOnClickToggleMode,
    handleOnChangeHasCrosshair,
}: Props) {
    const onChangeTool = (event: SelectChangeEvent<unknown>) => {
        const id = event.target.value as string;

        handleOnChangeTool(id);
    };

    const onClickClear = () => {
        handleOnClickClear();
    };

    const onClickUndo = () => {
        handleOnClickUndo();
    };

    const onChangeSize = (value: number) => {
        handleOnChangeSize(value);
    };

    const onChangeIsDrawingHidden = () => {
        handleOnChangeIsDrawingHidden();
    };

    const onClickToggleMode = () => {
        handleOnClickToggleMode();
    };

    const onChangeHasCrosshair = () => {
        handleOnChangeHasCrosshair();
    };

    return (
        <Box className="tools-container" data-testid="tools-container">
            <Box sx={{ width: '200px' }}>
                {isInpaintMode && (
                    <>
                        <Select
                            name="tools"
                            displayEmpty
                            value={tool}
                            onChange={onChangeTool}
                            sx={{ width: '100%' }}
                            disabled={isDrawingHidden}
                        >
                            <MenuItem value={PEN}>Pen</MenuItem>
                            <MenuItem value={ERASER} disabled={!hasDrawing}>
                                Eraser
                            </MenuItem>
                        </Select>

                        <Box sx={{ width: '100%', margin: '5px 0 0' }}>
                            <Slider
                                aria-label="Tool size slider"
                                defaultValue={0}
                                value={size}
                                min={1}
                                max={80}
                                step={1}
                                onChange={(_, value) =>
                                    onChangeSize(value as number)
                                }
                                disabled={isDrawingHidden}
                                color={
                                    tool === ERASER ? 'primary' : 'secondary'
                                }
                            />
                        </Box>
                    </>
                )}
            </Box>

            {isInpaintMode && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '500px',
                    }}
                >
                    <Button
                        onClick={onClickClear}
                        disabled={isDrawingHidden || !hasDrawing}
                    >
                        clear all
                    </Button>

                    <Button
                        onClick={onClickUndo}
                        disabled={isDrawingHidden || !hasDrawing}
                    >
                        undo
                    </Button>

                    <FormControlLabel
                        disabled={isDrawingHidden}
                        control={
                            <Checkbox
                                checked={hasCrosshair}
                                onChange={onChangeHasCrosshair}
                                color="secondary"
                            />
                        }
                        label="Crosshair"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={!isDrawingHidden}
                                onChange={onChangeIsDrawingHidden}
                            />
                        }
                        label={isDrawingHidden ? 'Show Mask' : 'Hide Mask'}
                        labelPlacement="end"
                        sx={{ width: '150px' }}
                    />
                </Box>
            )}

            <Button
                variant={isInpaintMode ? 'outlined' : 'contained'}
                onClick={onClickToggleMode}
                sx={{ width: '100px', marginLeft: '100px' }}
            >
                {isInpaintMode ? 'exit' : 'inpaint'}
            </Button>
        </Box>
    );
}

export default Tools;
