import React, { useState } from 'react';
import { KeyboardAvoidingView, TextInput, View, StyleSheet, ImageBackground, Image, Text, TouchableOpacity } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import background from '../assets/backImage.jpg';

export default function SignUp({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passRepeated, setPassRepeated] = useState('');

    async function handleSubmit(){
        if(!(password === passRepeated)){
            return alert("As senhas não estão iguais.");
        }

        await api.post('/register', {
            username,
            password,
            email
        }).then(response => {
            if(response.status === 200 && response.data.user){
                alert("Cadastro efetuado com sucesso! Faça login com o usuário " + response.data.user);
            
                navigation.navigate('Login');
            }else{
                throw new Exception('Erro ao cadastrar.');
            }
        }).catch(error => {
            if(error.response && error.response.data.msg){
                return alert(error.response.data.msg);
            }
            if(error.message){
                return alert(error.message);
            }
        });
    }

    function navigateLogin(){
        navigation.navigate('Login');
    }

    return (
        <KeyboardAvoidingView 
            behavior="padding"
            enabled={Platform.OS === 'ios'}
            style={styles.container}
        >
            <View style={styles.paddingView}>
                <Text style={styles.titleText}>Cadastro FinDev</Text>
                <Image source={logo}/>
                <Text style={styles.appNameText}>FinDev</Text>
                <TextInput 
                    placeholder="Usuário do Github"
                    placeholderTextColor="#000"
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput 
                    placeholder="E-mail"
                    placeholderTextColor="#000"
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                />
                <TextInput 
                    placeholder="Senha"
                    placeholderTextColor="#000"
                    style={styles.input}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput 
                    placeholder="Repita a senha"
                    placeholderTextColor="#000"
                    style={styles.input}
                    secureTextEntry={true}
                    value={passRepeated}
                    onChangeText={setPassRepeated}
                />
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>
                        Cadastrar
                    </Text>
                </TouchableOpacity>
                <View style={styles.loginView}>
                    <Text style={styles.textLoginNormal}>Já possui um cadastro? </Text>
                    <TouchableOpacity onPress={navigateLogin}>
                        <Text style={styles.textLogin}>
                            Entrar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ImageBackground source={background} style={styles.backgroundImg}></ImageBackground>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#290a59',
        justifyContent: 'center',
        alignItems: 'center',
    },

    paddingView: {
        backgroundColor: '#FFF',
        width: '80%',
        height: '80%',
        borderRadius: 5,
        opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },

    backgroundImg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
        opacity: 0.09,
    },

    titleText: {
        color: '#290a59',
        fontSize: 20,
    },

    appNameText: {
        color: '#000',
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
        color: '#000',
        textAlign: 'justify',
        marginBottom: 10,
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

    loginView: {
        flexDirection: 'row',
        marginTop: 10,
    },

    textLoginNormal: {
        color: '#000',
        opacity: 0.5,
    },

    textLogin: {
        color: '#000',
        opacity: 0.7,
        textDecorationLine: 'underline'
    },
});