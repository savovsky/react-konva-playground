/** Copyright (c) 2023-present ORBIS DS Authors. */

import React, { useEffect, useState } from 'react';

/**
 * Provides the element width and height on the element resize
 * @param elementRef
 * @returns object
 */
const useElementSize = (elementRef: React.RefObject<HTMLElement>) => {
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        const container = elementRef.current;

        if (!container) return;

        // const { offsetWidth, offsetHeight } = element;

        setWidth(container.offsetWidth);
        setHeight(container.offsetHeight);

        const handleResize = () => {
            // Do something when the element is resized
            // console.log({ container });
            setWidth(container.offsetWidth);
            setHeight(container.offsetHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup the observer by unobserving all elements
        // eslint-disable-next-line consistent-return
        return () => {
            window.removeEventListener('resize', handleResize);
        };

        // useEffect(() => {
        //     const element = elementRef.current;

        //     if (!element) return;

        //     const handleResize = () => {
        //         // Do something when the element is resized
        //         const { offsetWidth, offsetHeight } = element;
        //         setWidth(offsetWidth);
        //         setHeight(offsetHeight);
        //     };

        //     const observer = new ResizeObserver(handleResize);

        //     observer.observe(element);

        //     // Cleanup the observer by unobserving all elements
        //     // eslint-disable-next-line consistent-return
        //     return () => {
        //         observer.disconnect();
        //     };
    }, []);

    return { width, height };
};

export default useElementSize;
