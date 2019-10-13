import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Image, Text, TouchableOpacity } from 'react-native';

import background from '../assets/backImage.jpg';
import api from '../services/api';
import imgCancel from '../assets/cancel.png';
import imgLike from '../assets/likeYellow.png';

export default function Main({ navigation }) {
    const account = JSON.parse(navigation.getParam('account'));
    const [users, setUsers] = useState([]);


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
    }, [account]);

    async function handleLike(id) {
        await api.post(`/devs/${id}/likes`, null, {
            headers: {user: account._id}
        });

        setUsers(users.filter(user => user._id !== id));
    }

    async function handleDislike(id) {
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: {user: account._id}
        });

        setUsers(users.filter(user => user._id !== id));
    }

    async function logoutFunction() {
        logout();
        history.push(`/`);
    }

    return (
        <View style={styles.container}>
            <View style={styles.paddingView}>
                <View>

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

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Image source={imgCancel}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Image source={imgLike}/>
                    </TouchableOpacity>
                </View>
            </View>
            <ImageBackground source={background} style={styles.backgroundImg}></ImageBackground>
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
        opacity: 0.09,
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
});