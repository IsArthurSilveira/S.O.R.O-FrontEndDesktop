// src/components/Header/Header.tsx
import React from 'react';

const Header: React.FC = () => {
    return (
        <div className='bg-white border-b border-gray-200 h-20 flex items-center px-6 shadow-sm w-full'>
            <h1 className='font-poppins text-xl font-semibold text-foreground'>S.O.R.O Desktop</h1>    
            <div className="ml-auto">
            </div>
        </div>
    )
}
export default Header;