import * as actionTypes from './actionTypes'
import jwt from 'jsonwebtoken';
import { BASE_URL } from './cofig';
const options = data => {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify(data)
    };
};

export const checkUserUniqueness = ({ field, value }) => {
    return dispatch => {
        return fetch(BASE_URL + '/api/users/validate', options({ field, value }))
    }
}

export const userSignupRequest = (userSignupDetails) => {
    return dispatch => {
        return fetch(BASE_URL + '/api/users/signup', options(userSignupDetails))
    }
}

export const userLoginRequest = (userLoginDetails) => {
    return dispatch => {
        return fetch(BASE_URL + '/api/users/login', options(userLoginDetails))
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                const token = res.token;
                delete res.token;
                localStorage.setItem('jwtToken', token);
                dispatch({ type: actionTypes.LOGIN_SUCCESSFUL, authorizationToken: token, authenticatedUsername: jwt.decode(token).username });
            }
            return res;
        })
    }   
}

export const userLogoutRequest = () => {
    return dispatch => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('MyArticles');
        dispatch({ type: actionTypes.LOGOUT_USER });
    }
}