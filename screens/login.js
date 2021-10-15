import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Divider from 'react-native-divider';
import * as GoogleAuthentication from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as Facebook from 'expo-facebook';
import { firebase } from '../firebase/config';
import Global from '../utils/global';
import SvgIcon from '../utils/svg';

const LogIn = (props) => {

    const logInApple = () => {
        const nonce = Math.random().toString(36).substring(2, 10);
        Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce).then(hashedNonce => {
            AppleAuthentication.signInAsync({
                requestedScopes: [ AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL ],
                nonce: hashedNonce
            });
        }).then(appleCredential => {
            const { identityToken } = appleCredential;
            const provider = new firebase.auth.OAuthProvider('apple.com');
            const credential = provider.credential({
                idToken: identityToken,
                rawNonce: nonce,
            });
            firebase.auth().signInWithCredential(credential).then(() => {

            }).catch(err => {
                console.log(err);
                Promise.reject();
            });
        });
    }

    const logInFacebook = async() => {
        try {
            await Facebook.initializeAsync('553894349186153');
            const { type, token } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email'],
            });
            if(type === 'success') {
                const credential = firebase.auth.FacebookAuthProvider.credential(token);
                firebase.auth().signInWithCredential(credential).then(() => {
                    
                }).catch(err => {
                    console.log(err);
                });
            } else {

            }
        } catch(e) {
            console.log(e.message);
        }
    }

    const logInGoogle = () => {
        GoogleAuthentication.logInAsync({
            iosClientId: '1071101303373-govjjmc1jh8gt2mnl5qk57v75vd01oj9.apps.googleusercontent.com',
            scopes: ['profile', 'email']
        }).then(result => {
            if(result.type === 'success') {
                const { idToken, accessToken } = result;
                const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
                firebase.auth().signInWithCredential(credential).then(() => {

                }).catch(err => {
                    console.log(err);
                });
            } else {
                Promise.reject();
            }
        }).catch(err => {
            console.log(err);
        });
    }

    const logInEmail = () => {
        props.navigation.navigate('SignUp');
    }

    return (
        <View style={styles.bgContainer}>
            <View style={styles.giftImg}>
                <SvgIcon icon='logo'/>
            </View>
            <Text style={styles.title}>Find Your Perfect Gift!</Text>
            <Text style={styles.indication}>{'Are you ready to find your perfect gift?' + '\n' + 'Browse through a selection of cool gifts today!'}</Text> 
            <TouchableOpacity style={styles.appleBtn} onPress={logInApple}>
                <SvgIcon icon='apple'/>
                <Text style={styles.appleText}>Continue with Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.facebookBtn} onPress={logInFacebook}>
                <SvgIcon icon='facebook'/>
                <Text style={styles.facebookText}>Continue with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.googleBtn} onPress={logInGoogle}>
                <SvgIcon icon='google'/>
                <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>
            <Divider orientation='center' borderColor={Global.COLOR.GRAY74} color={Global.COLOR.GRAY74}>or</Divider>
            <TouchableOpacity style={styles.emailBtn} onPress={logInEmail}>
                <Text style={styles.emailText}>Continue with email</Text>
            </TouchableOpacity>
            <Text style={{ marginTop: 10, alignSelf: 'flex-start' }}>
                <Text style={styles.textNormal}>By continuing you agree to our </Text>
                <Text style={styles.textEm}>T&Cs. </Text>
                <Text style={styles.textNormal}>Please also check out our </Text>
                <Text style={styles.textEm}>Privacy Policy.</Text>
            </Text>
            <Text style={{ marginTop: 10, alignSelf: 'flex-start' }}>
                <Text style={styles.textNormal}>We use your data to offer you a personalized experience and to better understand and improve our services. For more information </Text>
                <Text style={styles.textEm}>see here.</Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bgContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 55,
    },
    giftImg: {
        alignItems: 'center',
    },
    title: {
        fontFamily: 'AvenirBlack',
        fontSize: 29,
        color: Global.COLOR.PRIMARY,
        marginTop: 40,
        fontWeight: 'bold',
    },
    indication: {
        fontFamily: 'AvenirBook',
        fontSize: 16,
        lineHeight: 21,
        color: Global.COLOR.GRAY74,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    appleBtn: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        backgroundColor: 'black',
        borderRadius: 5,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    facebookBtn: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        backgroundColor: Global.COLOR.FACEBOOK,
        borderRadius: 5,
        marginHorizontal: 20,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleBtn: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        borderRadius: 5,
        borderColor: Global.COLOR.BUTTON_BORDER,
        borderWidth: 2,
        marginHorizontal: 20,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emailBtn: {
        marginTop: 10,
        marginBottom: 20,
    },
    appleText: {
        fontSize: 18,
        color: 'white',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    facebookText: {
        fontSize: 17,
        color: 'white',
        marginLeft: 8,
    },
    googleText: {
        fontSize: 17,
        marginLeft: 8,
        fontWeight: 'bold',
    },
    emailText: {
        fontSize: 17,
        color: Global.COLOR.TEXT_EM,
    },
    textNormal: {
        fontSize: 11,
        color: Global.COLOR.GRAY74,
        letterSpacing: -0.4,
    },
    textEm: {
        fontSize: 12,
        color: Global.COLOR.TEXT_EM,
        fontWeight: 'bold',
    },
});

export default LogIn;
