import React from 'react';
import { imgAssets } from '../../utils/getAssets';
import { CircleLoading } from '../../utils/svgs';
import { SecondaryButton } from '../../shared/buttons';
import { cx } from '../../utils/helper';

const CustomConfirmationModal = ({
    isOpen, onClose, title = 'Successful!', description, handler, confirmationText = 'Remove', confirmationBtnCls = "", deleteModal = false, isLoading = false,
}) => {

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl w-full md:w-[576px] p-4 md:px-10 md:py-[60px] relative f-center flex-col gap-10 mx-4 md:mx-0 min-h-[436px]" style={{
                boxShadow: `0px 0px 40px 0px rgba(0, 0, 0, 0.05), 0px 9px 40px 0px rgba(0, 0, 0, 0.15)`
            }}>
                <img src={deleteModal ? imgAssets.modalQuestion : imgAssets.modalCheck} alt="modal" className=' mx-auto' />

                <div className='space-y-3 text-center'>
                    <h3 className='text-text-700 font-bold leading-[110%] text-xl md:text-[28px]'>
                        {deleteModal ? "Are you sure?" : title}
                    </h3>
                    <p className='text-sm md:text-base text-text-600'>
                        {description}
                    </p>
                </div>

                {deleteModal ? (<div className="flex justify-center items-center gap-x-4 w-full">

                    <button
                        className='h-[54px] w-[150px] border border-secondary-700 text-secondary-700 rounded-lg disabled:opacity-50'
                        onClick={() => onClose()}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>

                    <button
                        className={cx(
                            'h-[54px] w-[150px] font-semibold rounded-lg bg-status-error text-white',
                            isLoading && "f-center", confirmationBtnCls
                        )}
                        onClick={handler}
                    >
                        {isLoading ? <CircleLoading /> : confirmationText}
                    </button>

                </div>) : (
                    <SecondaryButton
                        text='Continue'
                        onClick={handler}
                    />
                )}

            </div>
        </div>
    );
};

export default CustomConfirmationModal;