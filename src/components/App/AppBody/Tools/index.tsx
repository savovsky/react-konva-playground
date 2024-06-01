/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import { SketchPicker } from 'react-color';
import ColorLensIcon from '@mui/icons-material/ColorLens';
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
    IconButton,
} from '@mui/material';

import { PEN, RECT, ERASER } from '../../../../utils/const';

type Props = {
    tool: string;
    size: number;
    isDrawingHidden: boolean;
    hasDrawing: boolean;
    isInpaintMode: boolean;
    hasCrosshair: boolean;
    isColorPickerOpen: boolean;
    color: string;
    handleOnChangeTool: Function;
    handleOnClickClear: Function;
    handleOnClickUndo: Function;
    handleOnChangeSize: Function;
    handleOnChangeIsDrawingHidden: Function;
    handleOnClickToggleMode: Function;
    handleOnChangeHasCrosshair: Function;
    handleOnClickLogBase64: Function;
    handleOnClickColorPicker: Function;
    handleOnColorChange: Function;
};

function Tools({
    tool,
    size,
    isDrawingHidden,
    hasDrawing,
    isInpaintMode,
    hasCrosshair,
    isColorPickerOpen,
    color,
    handleOnChangeTool,
    handleOnClickClear,
    handleOnClickUndo,
    handleOnChangeSize,
    handleOnChangeIsDrawingHidden,
    handleOnClickToggleMode,
    handleOnChangeHasCrosshair,
    handleOnClickLogBase64,
    handleOnClickColorPicker,
    handleOnColorChange,
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

    const onClickLogBase64 = () => {
        handleOnClickLogBase64();
    };

    const onClickColorPicker = () => {
        handleOnClickColorPicker();
    };

    const onColorChange = (selectedColor: { hex: string }) => {
        handleOnColorChange(selectedColor);
    };

    return (
        <Box className="tools-container" data-testid="tools-container">
            {isInpaintMode && (
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ width: '200px' }}>
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
                                <MenuItem value={RECT}>Rectangle</MenuItem>
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
                                        tool === ERASER
                                            ? 'primary'
                                            : 'secondary'
                                    }
                                />
                            </Box>
                        </>
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                        <IconButton
                            onClick={onClickColorPicker}
                            disabled={tool === ERASER}
                        >
                            <ColorLensIcon sx={{ fontSize: '40px', color }} />
                        </IconButton>

                        {isColorPickerOpen && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    backgroundColor: 'white',
                                    zIndex: 10,
                                    top: 0,
                                    left: 10,
                                }}
                            >
                                <SketchPicker
                                    color={color}
                                    disableAlpha
                                    onChangeComplete={(selectedColor) =>
                                        onColorChange(selectedColor)
                                    }
                                />
                            </Box>
                        )}
                    </Box>
                </Box>
            )}

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
                        disabled={isDrawingHidden || tool === RECT}
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

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '100px',
                    alignItems: 'end',
                }}
            >
                <Button
                    variant={isInpaintMode ? 'outlined' : 'contained'}
                    onClick={onClickToggleMode}
                    sx={{
                        display: 'block',
                        width: '100px',
                        marginBottom: '15px',
                    }}
                >
                    {isInpaintMode ? 'exit' : 'inpaint'}
                </Button>
                <Button variant="contained" onClick={onClickLogBase64}>
                    log base64
                </Button>
            </Box>
        </Box>
    );
}

export default Tools;
