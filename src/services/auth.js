import AsyncStorage from '@react-native-community/async-storage';

export const getAccount = async () => await AsyncStorage.getItem('account');
export const getToken = async () => await AsyncStorage.getItem('token');

export const setAccount = async account => {
    await AsyncStorage.setItem('account', account);
}
export const setToken = async token => {
    await AsyncStorage.setItem('token', token);
}

export const logout = async () => {
    await AsyncStorage.clear();
}