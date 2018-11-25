import React from 'react';
import './Profile.css';
import default_pic from './default_pic.png';

export default function Profile(props) {
    return (
        <div className="centered">
            <img src={props.src || default_pic} alt="Profile pic" />
            <strong><p>{props.name}</p></strong>
        </div>
    )
}
