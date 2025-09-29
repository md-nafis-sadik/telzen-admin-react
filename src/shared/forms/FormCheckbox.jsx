import React from 'react';

const FormCheckbox = ({ label, strongLabel, id, isLoading = false, ...props }) => {
    return (
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                id={id}
                className="checkbox appearance-none w-6 h-6 border-2 border-main-black rounded-md checked:bg-main-black checked:border-transparent focus:outline-none cursor-pointer relative disabled:bg-text-disabled disabled:cursor-not-allowed disabled:opacity-50 disabled:placeholder:text-main-black"
                disabled={isLoading}
                {...props}
            />
            <label htmlFor={id} className="text-text-700 cursor-pointer">
                {label}{" "}
                {strongLabel ? (
                    <span className="text-main-black font-bold">{strongLabel}</span>
                ) : null}
            </label>
            {/* Add custom checkmark using inline styles */}
            <style>{`
                .checkbox:checked::before {
                    content: '\\2713';
                    display: block;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 1rem;
                }
            `}</style>
        </div>
    );
};

export default FormCheckbox;
