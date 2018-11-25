import React, { Component } from 'react';
import './Profile.css';
import default_pic from './default_pic.png';
import FileChooser from '../utils/ImgFromFile';
import { Icon } from 'antd';

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.fileChooserElement = null;
    }

    handleFileChooserButton = () => {
        this.fileChooserElement.click();
    }

    handleFileChooser(e) {
        let files = e.target.files;
        if (files.length > 0) {
            if (files[0].type.indexOf('image') !== -1) {
                FileChooser.imageAsBase64(e.target.files[0])
                    .then((image) => console.log("image loaded", image));
            }
        }
    }

    render() {
        return (
            <div className="centered">
                <div className="profile-pic-container">
                    <img src={this.props.src || default_pic} alt="Profile pic" />
                    <div onClick={this.handleFileChooserButton} className="overlay">
                        <Icon style={{
                            fontSize: '70px',
                            color: '#FFFFFF',
                            top: '25%',
                            left: '25%',
                            position: 'absolute'
                        }}
                            type="upload"
                        />
                    </div>
                    <input
                        type="file"
                        id="attachment"
                        style={{ display: 'none' }}
                        ref={input => this.fileChooserElement = input}
                        onChange={this.handleFileChooser}
                        accept="image/*"
                    />
                </div>
                <strong><p>{this.props.name}</p></strong>
            </div>
        )
    }
}
