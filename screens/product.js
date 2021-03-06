import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import SwipeCards from 'react-native-swipe-cards-deck';
import LottieView from 'lottie-react-native';
import Avatar from './components/avatar';
import Global from '../utils/global';
import Header from './components/header';
import Loading from './loading';
import GiftCard from './components/giftcard';
import { getProducts, getContacts, addFavorite } from '../firebase/crud';
import { addLocalFavorite, getLocalContacts } from '../utils/db';
import { useSelector, useDispatch } from 'react-redux';
import { changeRecipient } from '../store/actions/actions';
import FilterDlg from './components/filter';
import DetailDlg from './components/detail';
import NewDlg from './components/new';
import PickerDlg from './components/picker';

const Product = (props) => {

    const userId = useSelector(state => state.user.userId);
    const recipient = useSelector(state => state.user.recipient);
    const dispatch = useDispatch();

    const [isLoaded, setLoaded] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [contactVisible, setContactVisible] = useState(false);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [productData, setProductData] = useState([]);
    const [contactData, setContactData] = useState([]);
    const [itemDetail, setItemDetail] = useState({});
    const [filterOption, setFilterOption] = useState({ price: 0, age: 9, gender: 2 });
    const tinderCards = useRef(null);

    useEffect(() => {
        const listener = props.navigation.addListener('didFocus', () => {
            updateContactData();
        });
        
        return () => listener.remove();
    }, []);

    useEffect(() => {
        setLoaded(false);
        getProducts(filterOption).then(result => {
            setProductData(result);
            setLoaded(true);
        }).catch(err => console.log(err));
    }, [filterOption]);

    useEffect(() => {
        if(!contactVisible)
            updateContactData(true);
    }, [contactVisible]);

    const updateContactData = (flag = false) => {
        //console.log(userId);
        if(userId == null) {
            getLocalContacts().then(result => {
                if(result != null) {
                    if(result.length < 1)
                        setContactVisible(true);
                    else {
                        setContactData(result);
                        if(flag)
                            dispatch(changeRecipient(result[0]));
                    }
                }
            }).catch(err => console.log(err));
        } else {
            getContacts(userId).then(result => {
                if(result != null) {
                    if(result.length < 1)
                        setContactVisible(true);
                    else {
                        setContactData(result);
                        if(flag)
                            dispatch(changeRecipient(result[0]));
                    }
                }
            }).catch(err => console.log(err));
        }
    }

    const handleNope = () => {
        return true;
    }
    
    const handleYup = card => {
        addToFavorite(card);
        return true;
    }

    const pressDislikeAction = () => {
        tinderCards.current.swipeNope();
    }

    const pressLikeAction = () => {
        addToFavorite(tinderCards.current.state.card);
        tinderCards.current.swipeYup();
    }

    const pressDetailView = item => {
        const detailData = {
            currency: item.currency,
            price: item.price,
            name: item.name,
            description: item.description,
            review: item.review,
        };
        setItemDetail(detailData);
        setDetailVisible(true);
    }

    const addToFavorite = item => {
        //console.log(item.docId);
        if(userId == null) {
            addLocalFavorite(recipient, item.docId).then(result => {
                if(result) {
                    let target = recipient;
                    target.favorites.push(item.docId);
                    dispatch(changeRecipient(target));
                }
            }).catch(err => console.log(err));
        } else {
            addFavorite(userId, recipient, item.docId).then(() => {
                let target = recipient;
                if(!target.favorites.includes(item.docId)) {
                    target.favorites.push(item.docId);
                    dispatch(changeRecipient(target));
                }
            }).catch(err => console.log(err));
        }
    }

    const pressRefreshAction = () => {
        const option = {
            price: filterOption.price,
            age: filterOption.age,
            gender: filterOption.gender,
        };
        setFilterOption(option);
    }

    if(!isLoaded)
        return (<Loading/>);

    const renderCardItem = item => (
        <GiftCard data={item} dotColor={Global.COLOR.PRIMARY} onClickDetail={() => pressDetailView(item)}/>
    );

    const renderNoCardItem = () => (
        <View>
            <LottieView
                source={Global.ANIMATION.TEAR}
                style={{ width: 200, height: 200 }}
                autoPlay
                loop
            />
            <Text style={styles.noText}>No more gifts ...</Text>
            <TouchableOpacity style={styles.reloadBtn} onPress={pressRefreshAction}>
                <Image source={Global.IMAGE.RELOAD} style={{ width: 50, height: 50 }}/>
            </TouchableOpacity>
        </View>
    );
    
    return (
        <View style={styles.bgContainer}>
            <Header page='product'/>
            <View style={styles.body}>
                <SwipeCards
                    ref={tinderCards}
                    cards={productData}
                    renderCard={renderCardItem}
                    keyExtractor={item => item.id}
                    renderNoMoreCards={renderNoCardItem}
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
            <View style={styles.footer}>
                <View style={styles.filterContainer}>
                    <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
                        <LinearGradient colors={['rgba(250, 250, 250, 1)', 'rgba(240, 240, 240, 1)']} style={[styles.gradContainer, { borderRadius: Global.SIZE.W_55 / 2 }]}>
                            <Icon name='filter' type='font-awesome-5' color={Global.COLOR.ICON_ACTIVE} size={20}/>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={styles.dislikeContainer}>
                    <TouchableOpacity style={styles.roundBtn} onPress={pressDislikeAction}>
                        <LinearGradient colors={['rgba(249, 219, 222, 1)', 'white']} style={styles.gradContainer}>
                            <Icon name='close' type='ionicon' color={Global.COLOR.PRIMARY} size={40}/>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={styles.likeContainer}>
                    <TouchableOpacity style={styles.roundBtn} onPress={pressLikeAction}>
                        <LinearGradient colors={['rgba(220, 249, 232, 1)', 'white']} style={styles.gradContainer}>
                            <Icon name='heart' type='ionicon' color={Global.COLOR.SECONDARY} size={37}/>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={styles.recipientContainer}>
                    <Pressable onPress={() => setPickerVisible(true)}>
                        {
                            recipient == null ?
                                <Image source={Global.IMAGE.UNKNOWN} style={styles.avatar}/>
                            :   <Avatar source={recipient.avatar} size={Global.SIZE.W_55} firstName={recipient.first_name} lastName={recipient.last_name}/>
                        }
                    </Pressable>
                </View>
            </View>
            { filterVisible ? <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: Global.COLOR.BLACK_40 }}/> : null }
            <FilterDlg
                visible={filterVisible}
                data={filterOption}
                onChangeVisible={setFilterVisible}
                onChangeValue={setFilterOption}
            />
            <DetailDlg
                visible={detailVisible}
                data={itemDetail}
                onChangeVisible={setDetailVisible}
            />
            <NewDlg
                visible={contactVisible}
                onChangeVisible={setContactVisible}
                required
            />
            <PickerDlg
                visible={pickerVisible}
                onChangeVisible={setPickerVisible}
                data={contactData}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    bgContainer: {
        flex: 1,
        backgroundColor: Global.COLOR.BACKGROUND,
        alignItems: 'center',
    },
    body: {
        width: '100%',
        height: Global.SIZE.W_522,
    },
    noText: {
        fontFamily: 'AvenirBlack',
        fontSize: 22,
        textAlign: 'center',
        marginTop: 10,
    },
    footer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: Global.SIZE.W_20,
        paddingTop: Global.SIZE.W_20,
    },
    filterContainer: {
        flex: 1,
        paddingTop: 13,
    },
    filterBtn: {
        width: Global.SIZE.W_55,
        height: Global.SIZE.W_55,
        borderRadius: Global.SIZE.W_55 / 2,
        backgroundColor: 'white',
        shadowOffset: { width: 2, height: 5 },
        shadowRadius: 10,
        shadowOpacity: 0.2,
        shadowColor: 'black',
        elevation: 5,
    },
    dislikeContainer: {
        flex: 1,
        paddingTop: 30,
    },
    roundBtn: {
        width: Global.SIZE.W_60,
        height: Global.SIZE.W_60,
        borderRadius: Global.SIZE.W_60 / 2,
        backgroundColor: 'white',
        shadowOffset: { width: 2, height: 5 },
        shadowRadius: 10,
        shadowOpacity: 0.2,
        shadowColor: 'black',
        elevation: 5,
    },
    likeContainer: {
        flex: 1,
        paddingTop: 30,
        alignItems: 'flex-end',
    },
    gradContainer: {
        flex: 1,
        borderRadius: Global.SIZE.W_60 / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipientContainer: {
        flex: 1,
        paddingTop: 13,
        alignItems: 'flex-end',
    },
    avatar: {
        width: Global.SIZE.W_55,
        height: Global.SIZE.W_55,
        borderRadius: Global.SIZE.W_55 / 2,
    },
    reloadBtn: {
        marginTop: 60,
        alignSelf: 'center',
    },
});

export default Product;
