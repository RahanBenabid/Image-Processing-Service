import React from 'react';
import { benefits } from '../constants';

const MegaMenu = ({ onMouseEnter, onMouseLeave }) => {
  const column1 = benefits.slice(0, 3);
  const column2 = benefits.slice(3, 6);
  const column3 = benefits.slice(6);

  return (
    <div 
      className="absolute flex justify-around items-start  top-full  transform -translate-x-1/2 w-[60rem] max-w-7xl lg:backdrop-blur-sm bg-n-8 shadow-3xl py-8 border-t border-n-6 rounded-2xl z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-full mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            {column1.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.title.toLowerCase()}`} 
                className="flex items-center gap-6 py-4 px-4 rounded-lg transition-all duration-300 hover:bg-n-7 hover:text-color-1 group"
              >
                <div className="w-12 h-12 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
                </div>
                <span className="font-medium text-lg group-hover:translate-x-1 transition-transform duration-300">{item.title}</span>
              </a>
            ))}
          </div>

          <div>
            {column2.map((item) => (
              <a  
                key={item.id}  
                href={`#${item.title.toLowerCase()}`} 
                className="flex items-center gap-6 py-4 px-4 rounded-lg transition-all duration-300 hover:bg-n-7 hover:text-color-1 group"
              >
                <div className="w-12 h-12 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
                </div>
                <span className="font-medium text-lg group-hover:translate-x-1 transition-transform duration-300">{item.title}</span>
              </a>
            ))}
          </div>

          <div>
            {column3.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.title.toLowerCase()}`} 
                className="flex items-center gap-6 py-4 px-4 rounded-lg transition-all duration-300 hover:bg-n-7 hover:text-color-1 group"
              >
                <div className="w-12 h-12 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
                </div>
                <span className="font-medium text-lg group-hover:translate-x-1 transition-transform duration-300">{item.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;