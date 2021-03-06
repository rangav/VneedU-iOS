/**
 * Created by jakes on 4/16/16.
 */
'use strict';

import React, {Component} from "react";
import {StyleSheet, StatusBar, View, Text, TabBarIOS} from "react-native";
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Color from '../Common/Color';
import HeaderBar from '../Component/HeaderBar';
import Home from './TabView/Home';
import Order from './TabView/Order';
import Me from './TabView/Me';

import {
    load_cache_from_local,
    save_cache_to_local,
    set_tabbar,
} from '../Redux/Actions/AppAction';
import {
    load_user_orders,
} from '../Redux/Actions/OrderAction';
import { load_new_requirements } from '../Redux/Actions/RequirementAction';

import {
    loadUserFromStorage,
    refresh_user,
} from '../Redux/Actions/UserAction';

class Main extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            statusBar: 'default',
        }
        this.timer = setInterval(()=> {
            this.props.dispatch(save_cache_to_local());
        }, 30000);
    }

    componentDidMount() {
        this.props.dispatch(load_cache_from_local());
    }
    
    componentWillUnmount() {
        this.props.dispatch(save_cache_to_local());
    }
    
    turnToMe(logined = false) {
        if (!logined) {
            Actions.login();
        } else {
            this.props.dispatch(set_tabbar('me', false));
            this.props.dispatch(refresh_user(this.props.entity.currentUser.user));
            this.setState({statusBar: 'light-content'})
        }
    }

    _renderContent() {
        switch(this.props.app.selectedTab) {
            case 'home':
                return <Home {...this.props} />;
            case 'order':
                return <Order {...this.props} />;
            case 'me':
                return <Me {...this.props} />;
            default:
                return <Home {...this.props} />;
        }
    }

    render() {
        let logined = (this.props.entity.currentUser.user || {}).hasOwnProperty('id');
        
        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <StatusBar 
                    animated={false}
                    barStyle={this.state.statusBar}/>
                <TabBarIOS
                    tintColor={Color.tabBarColor.tabColor}
                    barTintColor={Color.tabBarColor.tabBgColor}
                    style={[styles.tabContainer, {top: this.props.app.showTopBar ? 56 : 0}]}>
                    <Icon.TabBarItem
                        name="home"
                        title="首页"
                        iconName="ios-home-outline"
                        selectedIconName="ios-home"
                        selected={this.props.app.selectedTab === 'home'}
                        onPress={()=> {
                            if (this.props.app.selectedTab === 'home') {
                                this.props.dispatch(load_new_requirements('latest', 1));
                            } else {
                                this.props.dispatch(set_tabbar('home', true));
                                this.setState({statusBar: 'default'});
                            }
                        }} >
                        {this._renderContent()}
                    </Icon.TabBarItem>
                    <Icon.TabBarItem
                        name="order"
                        title="订单"
                        iconName="ios-list-outline"
                        selectedIconName="ios-list"
                        selected={this.props.app.selectedTab === 'order'}
                        onPress={()=> {
                            if (logined) {
                                if (this.props.app.selectedTab === 'order') {
                                    this.props.dispatch(load_user_orders(this.props.entity.currentUser.user, 1));
                                } else {
                                    this.props.dispatch(set_tabbar('order', true));
                                    this.props.dispatch(refresh_user(this.props.entity.currentUser.user));
                                    this.setState({statusBar: 'default'});
                                }
                            } else {
                                Actions.login();
                            }
                        }}>
                        {this._renderContent()}
                    </Icon.TabBarItem>
                    <Icon.TabBarItem
                        name="me"
                        title="我"
                        iconName="ios-person-outline"
                        selectedIconName="ios-person"
                        selected={this.props.app.selectedTab === 'me'}
                        onPress={this.turnToMe.bind(this, logined)}>
                        {this._renderContent()}
                    </Icon.TabBarItem>
                </TabBarIOS>
                {(()=> {
                    if (this.props.app.showTopBar) {
                        return <HeaderBar style={styles.topBar} {...this.props} title=''/>;
                    }
                })()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topBar: {
        position:'absolute', 
        top: 0, 
        left: 0
    },
    tabContainer: {
        backgroundColor:'#F6F6F6',
        position:'absolute', 
        left: 0,
        bottom: 0,
        right: 0,
    },
});

export default connect((state)=>{
    let {
        app,
        currentUser,
        user,
        orders,
        requirement,
        comments,
        order,
    } = state;
    
    return {
        app,
        list: {
            orders,
            comments,
        },
        entity: {
            currentUser,
            user,
            order,
            requirement,
        }
    }
})(Main);
