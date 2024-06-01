/**
 * Retrieves an image width and height
 * @param image image URL or image base64
 */
export const retrieveImageDimensions = async (image: string) => {
    let imageWidth = 0;
    let imageHeight = 0;

    const img = new Image();
    img.src = image;

    try {
        await img.decode();
        const { width, height } = img;

        imageWidth = width;
        imageHeight = height;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }

    return { imageWidth, imageHeight };
};

export const resizeAndConvertImageIntoBase64png = async (
    image: string,
    targetWidth: number,
    targetHeight: number,
) => {
    const img = new Image();
    img.src = image;

    // Creates a canvas with the new dimensions
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (context) {
        // Draws the image onto the canvas
        context.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Converts and returns the canvas content as a Base64 encoded 'png' image
        return canvas.toDataURL('image/png');
    }

    const errorMsg =
        'Somthing went wrong with resizeAndConvertImageIntoBase64png';

    // eslint-disable-next-line no-console
    console.error(errorMsg);

    return errorMsg;
};

export const convertImageBase64Format = async (
    imageSrc: string,
    imgFormat: string,
) => {
    let imageWidth = 0;
    let imageHeight = 0;

    const img = new Image();
    img.src = imageSrc;

    try {
        await img.decode();
        const { width, height } = img;

        imageWidth = width;
        imageHeight = height;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }

    // Creates a canvas with the image dimensions
    const canvas = document.createElement('canvas');

    canvas.width = imageWidth;
    canvas.height = imageHeight;

    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (context) {
        // Draws the image onto the canvas
        context.drawImage(img, 0, 0, imageWidth, imageHeight);

        // Converts and returns the canvas content as a Base64 encoded image with provided format
        return canvas.toDataURL(`image/${imgFormat}`);
    }

    const errorMsg = 'Somthing went wrong with convertImageBase64Format';

    // eslint-disable-next-line no-console
    console.error(errorMsg);

    return errorMsg;
};

// Expects to receive an image with the format 'png' without background - only the 'mask' (the drawing)!
export const transformImageToMask = (
    image: HTMLImageElement,
    width: number,
    height: number,
) => {
    // Creates a canvas
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (context) {
        // Draws the image onto the canvas
        context.drawImage(image, 0, 0, width, height);

        const imageData = context.getImageData(0, 0, width, height);
        const { data } = imageData;

        // Loops over the image pixels one by one to change the pixel's color channels to change the drawing into a 'white' mask
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255; // red channel
            data[i + 1] = 255; // green channel
            data[i + 2] = 255; // blue channel
            // data[i + 3] is the alpha chanel (opacity)
            // alpha[0 - 255] <=> opacity[0 - 1]
        }

        context.putImageData(imageData, 0, 0);

        // Converts the canvas content as a Base64 encoded 'jpeg' image
        // This will add the 'black' background behind the 'mask' (the drawing)
        const imageBase64Jpeg = canvas.toDataURL('image/jpeg');

        // Converts and returns the image as a Base64 encoded 'png' image
        return convertImageBase64Format(imageBase64Jpeg, 'png');
    }

    const errorMsg = 'Somthing went wrong with transformImageToMask';

    // eslint-disable-next-line no-console
    console.error(errorMsg);

    return errorMsg;
};
