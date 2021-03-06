import { compose } from 'redux';
import Types from '../../Constants/ActionTypes';
import { filter } from '../../Common/Base';

import {
    loadFromStorage,
    saveToStorage,
    removeFromStorage, 
} from '../../Services/StorageService';

export function set_tabbar(tabName = 'home', show = true) {
    return {
        type: Types.SET_TABBAR,
        selected: tabName,
        showed: show,
    }
}

export function set_cdn(cdn_config) {
    return {
        type: Types.SET_CDN,
        cdn_config,
    }
}

export function set_pushstatus(pushIsOn) {
    return {
        type: Types.SET_PUSHSTATUS,
        pushIsOn,
    }
}

export function load_config() {
    return (dispatch) => {
        return compose(
            loadFromStorage('cdn_config').then((v) => {
                dispatch(set_cdn(JSON.parse(v)));
                console.log(v, '--- loading settings ----');
            }).done(),
            loadFromStorage('opts_config').then((v) => {
                dispatch(set_pushstatus( v ? JSON.parse(v).pushIsOn : false));
                console.log(v, '--- loaded settings ----');
            })
        );
    }
}

export function save_settings({ pushIsOn } = { pushIsOn: false }) {
    return (dispatch) => {
        return compose(
            saveToStorage('opts_config', JSON.stringify({pushIsOn,})).then(()=>{
                dispatch(set_pushstatus(pushIsOn));
            }),
        );
    }
}

function set_state(state) {
    return {
        type: Types.GLOBAL_SET_STATE,
        state,
    }
}

export function load_cache_from_local() {
    return (dispatch, getState)=> {
        return loadFromStorage('app').then((v)=> {
            if (v) {
                let value = JSON.parse(v);
                dispatch(set_state(value));
                console.log('load cache from local');
            }
        })
    }
}

export function save_cache_to_local() {
    return (dispatch, getState)=> {
        return saveToStorage('app', JSON.stringify(getState()))
            .then(()=> {
                console.info('save cache to local');
            });
    }
}
