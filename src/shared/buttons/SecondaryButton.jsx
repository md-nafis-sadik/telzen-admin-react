import React from 'react';
import { cx } from '../../utils/helper';
import { CircleLoading } from '../../utils/svgs';

const SecondaryButton = ({ text, css, startIcon, endIcon, textCss, height, width, isOutlined = false, isLoading = false, ...props }) => {
    return (
        <button
            {...props}
            className={cx(
                "rounded-lg text-base font-semibold outline-none trans disabled:cursor-not-allowed flex items-center justify-center uppercase",
                isOutlined ? "inline-flex px-6 py-2 bg-[#131313] text-white rounded-lg border disabled:text-text-disabled disabled:border-text-disabled" : "inline-flex px-6 py-3 bg-[#131313] text-white rounded-lg  border-none  disabled:bg-text-disabled",
                (endIcon || startIcon || isLoading) && 'f-center gap-x-2',
                height ? height : 'h-[48px]',
                width ? width : 'w-full',
                css
            )}
        >
            {isLoading ? <CircleLoading /> : (<>
                {startIcon && startIcon}
                {text ? <span className={cx(textCss)}>{text}</span> : null}
                {endIcon && endIcon}
            </>)}
        </button>
    );
};

export default SecondaryButton;