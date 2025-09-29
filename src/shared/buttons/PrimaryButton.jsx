import React from 'react';
import { cx } from '../../utils/helper';
import { CircleLoading } from '../../utils/svgs';

const PrimaryButton = ({ text, css, endIcon, startIcon, outline, textCss, height, width, isLoading = false, ...props }) => {
    return (
        <button
            {...props}
            className={cx(
                "rounded-[8px] font-semibold hover:bg-text-700 trans outline-none disabled:bg-text-disabled",
                outline ? "border border-main-black text-main-black hover:bg-main-black hover:text-white" : "bg-main-black text-white border-none",
                (endIcon || startIcon || isLoading) && 'f-center gap-x-2',
                height ? height : 'h-[54px]',
                width ? width : 'w-full md:w-[150px]',
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

export default PrimaryButton;