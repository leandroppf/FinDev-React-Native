import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { View, StyleSheet, ImageBackground, Image, Text, TouchableOpacity } from 'react-native';
import baseUrl from '../config/config';

import background from '../assets/backImage.jpg';
import api from '../services/api';
import imgCancel from '../assets/cancel.png';
import imgLike from '../assets/likeYellow.png';
import imgLogout from '../assets/logout.png';
import matchImg from '../assets/match.png';
import { logout, getAccount } from '../services/auth';

export default function Main({ navigation }) {
    const account = JSON.parse(navigation.getParam('account'));
    const [users, setUsers] = useState([]);

    const [matchDev, setMatchDev] = useState(null);

    useEffect(() => {
        async function loadUsers(){
            try{
                const response = await api.get('/devs', {
                    headers: {
                        user: account._id
                    }
                });
                
                setUsers(response.data);
            }catch(error){
                if(error.response && error.response.data.error){
                    return alert(error.response.data.error);
                }
                if(error.message){
                    return alert(error.message);
                }
            }
        }

        loadUsers();
    }, [account._id]);

    useEffect(() => {
        const socket = io(baseUrl, {
            query: { user: account._id}
        });

        socket.on('match', dev => {
            setMatchDev(dev);
        });
        
    }, [account._id]);

    async function handleLike() {
        const [firstUser, ...rest] = users;

        await api.post(`/devs/${firstUser._id}/likes`, null, {
            headers: {user: account._id}
        });

        setUsers(rest);
    }

    async function handleDislike() {
        const [firstUser, ...rest] = users;

        await api.post(`/devs/${firstUser._id}/dislikes`, null, {
            headers: {user: account._id}
        });

        setUsers(rest);
    }

    async function logoutFunction() {
        logout();
        navigation.navigate('Login');
    }

    async function navigateDislikes(){
        const accToPass = await getAccount();

        navigation.navigate('Dislikes', {account:accToPass});
    }

    async function navigateLikes(){
        const accToPass = await getAccount();

        navigation.navigate('Likes', {account:accToPass});
    }

    async function navigateMatch(){
        const accToPass = await getAccount();

        navigation.navigate('Matchs', {account:accToPass});
    }

    return (
        <View style={styles.container}>
            <View style={styles.paddingView}>
                <View style={{height: 150}}/>
                <View style={styles.topView}>
                    <View style={styles.infoView}>
                        <Image style={styles.accountImg} source={{ uri: account.avatar}}/>
                        <Text style={styles.name}>{account.name}</Text>
                    </View>
                    <View style={styles.topButtonsView}>
                        <TouchableOpacity onPress={navigateDislikes} style={styles.topButton}>
                            <Text style={styles.buttonText}>
                                Sem interesse
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={navigateLikes} style={styles.topButton}>
                            <Text style={styles.buttonText}>
                                Curtidas
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.matchButtonView}>
                        <TouchableOpacity onPress={navigateMatch} style={styles.matchButton}>
                            <Text style={styles.buttonText}>
                                Combinações
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.cardsContainer}>
                    { users.length === 0 
                    ? <Text style={styles.empty}>Ainda não existem mais usuários para interagir.</Text>
                    : (
                        users.map((user, index) => (
                            <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                                <Image style={styles.avatar} source={{uri: user.avatar}}/>
                                <View style={styles.footer}>
                                    <Text style={styles.name}>{user.name}</Text>
                                    <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
                { users.length > 0 && (
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={handleDislike} style={styles.button}>
                            <Image source={imgCancel}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLike} style={styles.button}>
                            <Image source={imgLike}/>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <ImageBackground source={background} style={styles.backgroundImg}></ImageBackground>
            <View style={styles.logoutView}>
                <TouchableOpacity onPress={logoutFunction} style={styles.logoutButton}>
                    <Image source={imgLogout}/>
                </TouchableOpacity>
            </View>
            { matchDev && (
                <View style={styles.matchContainer}>
                    <Image style={styles.matchImage} source={matchImg}/>
                    <Text style={styles.matchTitleText}>Parabéns!!!</Text>
                    <Text style={styles.matchTitleText}>Você obteve uma combinação com</Text>
                    <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }}/>
                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>
                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.closeMatch}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#290a59',
        justifyContent: 'center',
        alignItems: 'center',
    },

    backgroundImg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
        opacity: 0.2,
    },

    paddingView: {
        flex: 1,
        padding: 30,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
        zIndex: 1,
    },

    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    avatar: {
        flex: 1,
        height: 300,
    },

    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },

    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 20,
    },

    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30,
        zIndex: 1,
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold',
    },

    logoutView: {
        position: 'absolute',
        right: 10,
        bottom: 10,
    },

    logoutButton: {
        maxHeight: 80,
        maxWidth: 80,
    },

    topView: {
        maxHeight: 150,
        alignSelf: 'stretch',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    infoView: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        opacity: 0.9,
    },

    accountImg: {
        width: 70,
        height: 70,
        marginRight: 20,
        borderRadius: 5,
    },

    topButtonsView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },

    topButton: {
        borderRadius: 3,
        height: 35,
        backgroundColor: '#290A59',
        margin: 5,
        minWidth: '35%',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFF',
    },

    matchButtonView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },

    matchButton: {
        borderRadius: 3,
        height: 35,
        backgroundColor: '#ff7c00',
        margin: 5,
        minWidth: '73%',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },

    matchImage: {
        height: 80,
        resizeMode: 'contain',
    },

    matchTitleText: {
        color: '#FFF',
        fontSize: 16,
    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#FFF',
        marginTop: 10,
        marginBottom: 30,
    },

    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
    },

    matchBio: {
        marginTop: 10,
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30,
    },

    closeMatch: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold',
    },
});