import React from 'react';
import { CATEGORIES } from '../constants';

const ServiceGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
                <a
                    key={cat.id}
                    href={`/services/${cat.id}`}
                    className="cursor-pointer group flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-gray-200 bg-white transition-all duration-300 hover:border-[#00C16E]/30 hover:shadow-md"
                >
                    <div className="mb-6 text-[#006837] transition-colors duration-300 group-hover:text-[#00C16E]">
                        {cat.icon}
                    </div>
                    <h3 className="text-center font-extrabold text-lg leading-tight text-[#006837] transition-colors duration-300 group-hover:text-[#00C16E]">
                        {cat.title}
                    </h3>
                </a>
            ))}
        </div>
    );
};

export default ServiceGrid;