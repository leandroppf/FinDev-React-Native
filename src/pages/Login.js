import React, { useState, useEffect } from 'react';
import { 
    KeyboardAvoidingView,
    View,
    Platform,
    StyleSheet,
    Image,
    TextInput,
    Text,
    TouchableOpacity,
    ImageBackground
} from 'react-native';

import logo from '../assets/logo.png';
import background from '../assets/backImage.jpg';
import api from '../services/api';
import { getAccount, getToken, setAccount, setToken } from '../services/auth';

export default function Login({ navigation }) {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        verifyCredentials();
    }, []);

    async function verifyCredentials(){
        const token = await getToken();
        const account = await getAccount();

        if(account && token){
            navigation.navigate('Main', {account});
        }
    }

    async function handleLogin() {
        try{
            const response = await api.post('/auth', {
                user,
                password
            });
    
            const { token } = response.data;
            const account = JSON.stringify(response.data.account);

            await setToken(token);
            await setAccount(account);
    
            navigation.navigate('Main', {account});
        }catch(error){
            if(error.response && error.response.data.error){
                return alert(error.response.data.error);
            }
            if(error.message){
                return alert(error.message);
            }
        }
    }

    return (
        <KeyboardAvoidingView
            behavior="padding"
            enabled={Platform.OS === 'ios'}
            style={styles.container}
        >
            <View style={styles.paddingView}>
                <Image source={logo}/>
                <Text style={styles.logoText}>FinDev</Text>

                <TextInput 
                    placeholder="Usuário"
                    placeholderTextColor="#FFF"
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={user}
                    onChangeText={setUser}
                />
                <TextInput 
                    placeholder="Senha"
                    placeholderTextColor="#FFF"
                    style={styles.input}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonForgotPass}>
                    <Text style={styles.textForgotPass}>
                        Esqueceu a sua senha?
                    </Text>
                </TouchableOpacity>

                <View style={styles.createAccountView}>
                    <Text style={styles.textSignupNormal}>Não tem uma conta? </Text>
                    <TouchableOpacity style={styles.buttonSignup}>
                        <Text style={styles.textSignup}>
                            Crie uma
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ImageBackground source={background} style={styles.backgroundImg}></ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#290a59',
        justifyContent: 'center',
        alignItems: 'center',
    },

    logoText: {
        color: '#FFF',
        opacity: 0.7,
        fontSize: 20,
        marginBottom: 50,
    },

    input: {
        height: 46,
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderBottomColor: '#999999',
        paddingHorizontal: 40,
        opacity: 0.7,
        color: '#FFF',
        textAlign: 'center',
    },

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#ff7c00',
        borderRadius: 4,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },

    buttonForgotPass: {
        marginTop: 10
    },

    textForgotPass: {
        color: '#FFF',
        opacity: 0.7,
        textDecorationLine: 'underline'
    },

    createAccountView: {
        flexDirection: 'row',
        marginTop: 10,
    },

    textSignupNormal: {
        color: '#FFF',
        opacity: 0.5,
    },

    buttonSignup: {
    },

    textSignup: {
        color: '#FFF',
        opacity: 0.7,
        textDecorationLine: 'underline'
    },

    backgroundImg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
        opacity: 0.09,
    },

    paddingView: {
        padding: 30,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
});