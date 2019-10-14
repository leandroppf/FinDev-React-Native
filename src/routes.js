import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './pages/Login';
import Main from './pages/Main';
import SignUp from './pages/SignUp';
import ForgotPass from './pages/ForgotPass';
import Dislikes from './pages/Dislikes';
import Likes from './pages/Likes';
import Matchs from './pages/Matchs';

export default createAppContainer(
    createSwitchNavigator({
        Login,
        Main,
        SignUp,
        ForgotPass,
        Dislikes,
        Likes,
        Matchs,
    })
);