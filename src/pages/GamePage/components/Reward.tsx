import React from 'react'
import { RewardType } from '../../../types';





const Reward: React.FC<RewardType> = ({  track, delay }) => {

    const bagStyle = {
        position: 'absolute',
        left: `${track === 1 ? 40 : 360}px`,
        top: `${track === 1 ? 140 : 260}px`,
        width: track === 1 ? '50px' : '80px',
        height: track === 1 ? '50px' : '80px',
        zIndex: 999,
        animation: track === 1 ? 'moveLeft 3s infinite' : 'moveRight 3s infinite',
        animationDelay: `${delay}s` // 添加延遲
  } as React.CSSProperties;

    
  return <div className={`lucky-bag ${track === 1 ? 'behind' : 'front'}`} style={bagStyle} />;
}

export default Reward