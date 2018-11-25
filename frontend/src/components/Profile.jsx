import React from 'react';
import './Profile.css';

export default function Profile(props) {
    return (
        <div className="centered">
            <img src={props.src} alt="Profile pic" />
            <strong><p>{props.name}</p></strong>
        </div>
    )
}
