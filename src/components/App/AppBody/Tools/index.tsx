/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import { SketchPicker } from 'react-color';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
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
    Divider,
} from '@mui/material';

import { PEN, RECT, ERASER, INPAINT, PAINT } from '../../../../utils/const';

type Props = {
    mode: string;
    tool: string;
    size: number;
    isDrawingHidden: boolean;
    hasDrawing: boolean;
    isInpaintMode: boolean;
    hasCrosshair: boolean;
    isColorPickerOpen: boolean;
    color: string;
    handleOnChangeMode: Function;
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
    handleOnClickAwayColorPicker: Function;
};

function Tools({
    mode,
    tool,
    size,
    isDrawingHidden,
    hasDrawing,
    isInpaintMode,
    hasCrosshair,
    isColorPickerOpen,
    color,
    handleOnChangeMode,
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
    handleOnClickAwayColorPicker,
}: Props) {
    const onChangeMode = (event: SelectChangeEvent<unknown>) => {
        const id = event.target.value as string;

        handleOnChangeMode(id);
    };

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

    const onClickAwayColorPicker = () => {
        handleOnClickAwayColorPicker();
    };

    const onColorChange = (selectedColor: { hex: string }) => {
        handleOnColorChange(selectedColor);
    };

    return (
        <Box className="tools-container" data-testid="tools-container">
            {!isInpaintMode && <Box />}
            {isInpaintMode && (
                <>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ width: '200px' }}>
                            <>
                                <Select
                                    name="tools"
                                    value={tool}
                                    onChange={onChangeTool}
                                    sx={{ width: '100%' }}
                                    disabled={isDrawingHidden}
                                >
                                    <MenuItem value={PEN}>Pen</MenuItem>
                                    <MenuItem
                                        value={ERASER}
                                        disabled={!hasDrawing}
                                    >
                                        Eraser
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem value={RECT}>Rectangle</MenuItem>
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
                                <ColorLensIcon
                                    sx={{ fontSize: '40px', color }}
                                />
                            </IconButton>

                            {isColorPickerOpen && (
                                <ClickAwayListener
                                    onClickAway={onClickAwayColorPicker}
                                >
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
                                </ClickAwayListener>
                            )}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            width: '500px',
                            marginRight: '30px',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
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
                                label="Mask"
                                labelPlacement="end"
                            />
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'center',
                                margin: '10px 5px 5px',
                            }}
                        >
                            <Select
                                name="mode"
                                value={mode}
                                onChange={onChangeMode}
                                sx={{ width: '120px' }}
                                size="small"
                            >
                                <MenuItem value={INPAINT}>Inpaint</MenuItem>
                                <MenuItem value={PAINT}>Paint</MenuItem>
                            </Select>
                        </Box>
                    </Box>
                </>
            )}

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '100px',
                    alignItems: 'end',
                    width: '130px',
                }}
            >
                <Button
                    variant={isInpaintMode ? 'outlined' : 'contained'}
                    onClick={onClickToggleMode}
                    sx={{
                        display: 'block',
                        width: '100%',
                        marginBottom: '15px',
                    }}
                >
                    {isInpaintMode ? 'exit' : 'draw'}
                </Button>
                {isInpaintMode && (
                    <Button
                        variant="contained"
                        onClick={onClickLogBase64}
                        disabled={!hasDrawing}
                        sx={{
                            width: '100%',
                        }}
                    >
                        log base64
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default Tools;
