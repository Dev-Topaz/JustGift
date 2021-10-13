import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Global from '../../utils/global';
import { getOccasionFromDate } from '../../utils/helper';
import { useSelector } from 'react-redux';

const ContactItem = (props) => {

    const userId = useSelector(state => state.user.userId);

    //const [isImgLoaded, setImgLoaded] = useState(false);
    const [img, setImg] = useState(null);
    const imgUri = FileSystem.cacheDirectory + props.data.docId;

    useEffect(() => {
        if(userId == null) {
            setImg(props.data.avatar);
            //setImgLoaded(true);
        } else {
            if(props.data.avatar != null)
                FileSystem.getInfoAsync(imgUri).then(metadata => {
                    if(metadata.exists) {
                        setImg(imgUri);
                        //setImgLoaded(true);
                    } else {
                        FileSystem.downloadAsync(props.data.avatar, imgUri).then(({ uri }) => {
                            setImg(uri);
                            //setImgLoaded(true);
                        }).catch(err => console.log(err));
                    }
                }).catch(err => console.log(err));
        }
    }, []);

    return (
        <View key={props.diffKey} style={styles.container}>
            <Pressable style={styles.item} onPress={props.onClickItem}>
                <Image source={img == null ? Global.IMAGE.UNKNOWN : { uri: img }} style={styles.avatar}/>
                <View style={styles.infoContainer}>
                    <Text style={styles.nameText}>{props.data.first_name + ' ' + props.data.last_name}</Text>
                    <Text>
                        <Text style={styles.indexText}>{props.data.occasion + ': '}</Text>
                        <Text style={styles.dateText}>{getOccasionFromDate(props.data.date)}</Text>
                    </Text>
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
        marginBottom: 12,
    },
    item: {
        flexDirection: 'row',
        width: Global.SIZE.W_355,
        height: Global.SIZE.W_88,
        borderRadius: 23,
        paddingHorizontal: 30,
        marginHorizontal: 30,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    avatar: {
        height: Global.SIZE.W_60,
        width: Global.SIZE.W_60,
        borderRadius: Global.SIZE.W_60 / 2,
    },
    infoContainer: {
        marginLeft: 20,
        justifyContent: 'center',
    },
    nameText: {
        fontFamily: 'AvenirBlack',
        fontSize: 16,
        color: 'rgba(49, 49, 49, 1)',
        marginBottom: 5,
    },
    indexText: {
        fontFamily: 'AvenirBook',
        fontSize: 14,
        color: 'rgba(206, 206, 206, 1)',
    },
    dateText: {
        fontFamily: 'AvenirBlack',
        fontSize: 14,
        color: 'rgba(206, 206, 206, 1)',
        fontWeight: 'bold',
    },
});

export default ContactItem;
