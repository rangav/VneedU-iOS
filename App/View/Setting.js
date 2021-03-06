import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    StatusBar,
    Switch,
    TouchableOpacity,
    Image,
    View,
    Text,
} from 'react-native';
import { Base } from '../Common/Base';
import { BorderStyles, ButtonStyles } from '../Common/Styles';
import NavigatorBar from '../Component/NavigatorBar';
import { set_pushstatus, save_settings } from '../Redux/Actions/AppAction';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

export default class Setting extends Component {
    constructor(props) {
        super(props);

        this.state = this.props.app
    }
    
    componentWillUnmount() {
        this.props.dispatch(save_settings({...this.state}));
    }
    
    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#F6F6F6'}}>
                <NavigatorBar title='设置' {...this.props}/>
                <View style={[BorderStyles.topAndBottom, {marginTop: 10, backgroundColor: '#FFF'}]}>
                    <View style={{flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 5, alignItems: 'center'}}>
                        <Text style={{color: 'rgba(0,0,0, .69)', flex: 1}}>
                            推送通知
                        </Text>
                        <Switch value={this.state.pushIsOn} onValueChange={(v)=> this.setState({pushIsOn: v})}/>
                    </View>
                    <View style={[{flexDirection: 'row', padding: 12}, BorderStyles.top]}>
                        <Text style={{color: 'rgba(0,0,0, .69)', flex: 1}}>
                            自动下载最新安装包
                        </Text>
                        <Text style={{color: 'rgba(98, 96, 96, .69)'}}>仅Wi-Fi网络</Text>
                    </View>
                </View>
                <View style={[BorderStyles.topAndBottom, {marginTop: 10, backgroundColor: '#FFF'}]}>
                    <TouchableOpacity onPress={()=> Actions.about()}>
                        <Text style={{color: 'rgba(0,0,0, .69)', padding: 12}}>
                            关于威尼优
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
