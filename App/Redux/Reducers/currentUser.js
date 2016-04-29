import Types from '../../Constants/ActionTypes';

const initialState = {
    isFetching: false,
    user: {},
    hasError: null, 
    result: null,
};

export default function reducer(state = initialState, action = {}) {
    switch(action.type) {
        case Types.SET_AUTHORIZATION:
            return {
                ...state,
                user: action.user,
            }
        case Types.REQUEST_LOGIN:
            return {
                ...state,
                isFetching: true,
                user: {},
                hasError: null, 
                result: null,
            }
        case Types.RECV_LOGIN:
            console.log(action.data.retData)
            return {
                ...state,
                isFetching: false,
                user: action.data.retData.user,
                hasError: action.data.error, 
                result: action.data.message,
            }
        case Types.LOGOUT:
            return initialState;
        default:
            return state;
    }
}
