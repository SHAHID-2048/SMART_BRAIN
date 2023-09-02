import React from 'react';
import { Tilt } from 'react-tilt'
import './Logo.css'
import brain from './brain.png'
const defaultOptions = {
	max: 35,     
}
const Logo=()=>
{
    return (
        <div className='ma4 mt0'>
            <Tilt className='Tilt br2 shadow-2' options={defaultOptions} style={{ height: 100, width: 100 }}>
        <div className='Tilt-inner' pa3>
        <img style={{paddingTop:'15px'}} alt='logo' src={brain} heigth='75' width='75'></img></div>
        </Tilt>
        </div>
    )
}
export default Logo;