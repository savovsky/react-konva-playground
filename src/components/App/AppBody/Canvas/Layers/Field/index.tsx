import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

const url = 'us_football_field.jpg';

function Field() {
    const [image] = useImage(url);
    const scale = 0.5;

    // "image" will be DOM image element or undefined

    return (
        <Image
            scale={{ x: scale, y: scale }}
            image={image}
            rotation={-90}
            offsetX={1800}
            offsetY={-130}
        />
    );
}

export default Field;
