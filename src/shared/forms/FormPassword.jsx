import React, { useState } from 'react';
import FormInput from './FormInput';
import { EyeCloseSvg, EyeOpenSvg } from '../../utils/svgs';
import { cx } from '../../utils/helper';

const FormPassword = ({ label, isLoading = false, isCol = false, ...props }) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='relative'>
            <FormInput
                label={label}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                isLoading={isLoading}
                isCol={isCol}
                {...props}
            />

            <button
                className={cx(
                    "absolute right-4 ",
                    isCol ? "top-2/3 -translate-y-2/3 " : "top-1/2 -translate-y-1/2"
                )}
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <EyeCloseSvg /> : <EyeOpenSvg />}
            </button>
        </div>
    );
};

export default FormPassword;