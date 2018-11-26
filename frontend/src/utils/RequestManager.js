import HOST from '../settings';

const listUsers = (filter) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + localStorage.getItem('token'),
        }
    };
    let qs = '';
    if (filter) {
        qs = `?q=${filter}`;
    }
    return fetch(`${HOST}/users${qs}`, options)
        .then((res) => res.json());
}

const listRooms = (filter) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + localStorage.getItem('token'),
        }
    };
    let qs = '';
    if (filter) {
        qs = `?q=${filter}`;
    }
    return fetch(`${HOST}/rooms${qs}`, options)
        .then((res) => res.json());
}

const createRoom = (body) => {
    let options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + localStorage.getItem('token'),
        }
    };

    return fetch(`${HOST}/rooms`, options)
        .then((res) => res.json());
}

const searchConversation = (filter) => {
    return Promise.all([
        listRooms(filter),
        listUsers(filter),
    ]);
}

const updateProfilePic = (image) => {
    let formData  = new FormData();
    formData.append('profile_pic', image)
    let options = {
        method: 'PATCH',
        body: formData,
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'Authorization': 'bearer ' + localStorage.getItem('token'),
        }
    };

    return fetch(`${HOST}/profile`, options);
}

const getMyInfo = () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + localStorage.getItem('token'),
        }
    };
    return fetch(`${HOST}/users/me`, options)
        .then((res) => res.json());
}

const getInfoFromRoom = (room_id) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + localStorage.getItem('token'),
        }
    };
    return fetch(`${HOST}/rooms/${room_id}`, options)
        .then((res) => res.json());
}

const getUsersFromRoom = (room_id) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + localStorage.getItem('token'),
        }
    };
    return fetch(`${HOST}/rooms/${room_id}/users`, options)
        .then((res) => res.json());
}


const login = (username, password) => {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            username,
            password,
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    };
    return fetch(`${HOST}/login`, options)
        .then((res) => res.json());
}

export {
    listUsers,
    listRooms,
    createRoom,
    searchConversation,
    updateProfilePic,
    getMyInfo,
    getInfoFromRoom,
    getUsersFromRoom,
    login,
}