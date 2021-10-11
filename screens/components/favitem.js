import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, Pressable } from 'react-native';
import LottieView from 'lottie-react-native';
import * as FileSystem from 'expo-file-system';
import Global from '../../utils/global';

const FavItem = (props) => {

    const [isImgLoaded, setImgLoaded] = useState(false);
    const [img, setImg] = useState(null);
    const imgUri = FileSystem.cacheDirectory + props.data.docId + '1';

    useEffect(() => {
        FileSystem.getInfoAsync(imgUri).then(metadata => {
            if(metadata.exists) {
                setImg(imgUri);
                setImgLoaded(true);
            } else {
                FileSystem.downloadAsync(props.data.img_1, imgUri).then(({ uri }) => {
                    setImg(uri);
                    setImgLoaded(true);
                }).catch(err => console.log(err));
            }
        }).catch(err => console.log(err));
    }, []);

    return (
        <View key={props.diffKey} style={styles.container}>
            <Pressable style={styles.item} onPress={props.onClickItem}>
                <View style={{ flex: 6 }}>
                    <Text style={styles.priceText}>{(props.data.currency == '0' ? '£' : '$') + props.data.price}</Text>
                    <Text style={styles.nameText}>{props.data.name}</Text>
                </View>
                <View style={{ flex: 4 }}>
                    {
                        isImgLoaded ? <Image source={{ uri: img }} style={styles.image}/>
                        : <LottieView
                            source={Global.ANIMATION.WAITING}
                            style={{ width: Global.SIZE.W_115, height: Global.SIZE.W_115 }}
                            autoPlay
                            loop
                          />
                    }
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        shadowOpacity: 0.2,
        shadowColor: 'black',
        elevation: 5,
        marginBottom: 15,
    },
    item: {
        flexDirection: 'row',
        width: Global.SIZE.W_380,
        height: Global.SIZE.W_115,
        borderRadius: 10,
        marginHorizontal: 15,
        paddingHorizontal: 35,
        paddingVertical: 10,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceText: {
        fontFamily: 'AvenirBook',
        fontSize: 17,
    },
    nameText: {
        fontFamily: 'AvenirBlack',
        fontSize: 17,
        marginTop: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        alignSelf: 'center',
    },
});

export default FavItem;
