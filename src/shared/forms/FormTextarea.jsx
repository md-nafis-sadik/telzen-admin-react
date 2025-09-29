import { cx } from "../../utils/helper";

const FormTextarea = ({ label, id, textareaCss, rows = 5, ...props }) => {
    return (
        <div>
            {label && (
                <label htmlFor={id} className="text-text-700 text-sm text-medium">
                    {label}
                </label>
            )}

            <textarea
                name={id}
                id={id}
                {...props}
                rows={rows}
                className={cx(
                    "w-full border border-neutral-300 rounded-[8px] px-4 py-3.5 outline-none text-text-700 placeholder:text-text-disabled bg-white resize-none",
                    label ? "mt-1" : "mt-0",
                    textareaCss,
                )}
            />
        </div>
    );
};

export default FormTextarea;