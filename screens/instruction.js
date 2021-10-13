import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, Image } from 'react-native';
import SwipeCards from 'react-native-swipe-cards-deck';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Global from '../utils/global';
import { useSelector } from 'react-redux';

const Instruction = (props) => {

    const isFirstRun = useSelector(state => state.setting.isFirstRun);
    const [index, setIndex] = useState(0);

    const handleNope = () => {
        if(index > 0) {
            if(isFirstRun)
                AsyncStorage.setItem('firstrun', '1', err => {
                    if(err) {
                        console.log('Error');
                        throw err;
                    } else {
                        props.navigation.navigate('Main');
                    }
                }).catch(err => {
                    console.log(err);
                });
            return true;
        } else
            return false;
    }

    const handleYup = () => {
        if(index < 1) {
            setIndex(index => index + 1);
            return true;
        } else
            return false;
    }

    const renderCardItem = item => (
        <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
                {
                    item.img == null ? null : <Image source={item.img} style={styles.itemImage}/>
                }
            </View>
        </View>
    );

    return (
        <ImageBackground source={Global.IMAGE.SWIPE_BACKGROUND} style={styles.bgContainer}>
            <View style={styles.container}>
                <SwipeCards
                    cards={data}
                    renderCard={renderCardItem}
                    keyExtractor={item => item.id}
                    actions={{
                        nope: { onAction: handleNope, show: false },
                        yup: { onAction: handleYup, show: false }
                    }}
                    smoothTransition={true}
                    hasMaybeAction={false}
                    stack={true}
                    stackOffsetX={0}
                    cardRemoved={() => {}}
                    loop={false}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bgContainer: {
        flex: 1,
        alignItems: 'center',
        resizeMode: 'cover',
    },
    container: {
        width: '100%',
        height: Global.SIZE.W_522,
        marginTop: 115,
    },
    itemContainer: {
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation: 5,
    },
    itemContent: {
        width: Global.SIZE.W_363,
        height: Global.SIZE.W_522,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'black',
    },
    itemImage: {
        width: '80%',
        resizeMode: 'contain',
        marginBottom: 50,
    },
});

const data = [
    {
        id: 0,
        img: Global.IMAGE.RIGHT
    },
    {
        id: 1,
        img: Global.IMAGE.LEFT
    },
    {
        id: 2,
        img: null
    }
];

export default Instruction;
