import React from 'react';
import { imgAssets } from '../../utils/getAssets';

const DataNotFound = ({ title, description }) => {
    return (
        <div className='f-center flex-col my-10 lg:my-0 lg:h-full min-h-[300px]'>
            <img src={imgAssets.fileCross} alt="not found" />

            <h2 className='mt-6 mb-4 text-text-700 text-2xl font-semibold leading-[110%]'>
                {title}
            </h2>

            <p className='text-text-600 max-w-[850px] text-center text-sm lg:text-base'>
                {description}
            </p>
        </div>
    );
};

export default DataNotFound;