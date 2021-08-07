import React, { useEffect, FC, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native'
import { createStackNavigator } from "@react-navigation/stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { DrawerActions } from "@react-navigation/routers";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/core";

// Redux
import { loadFavorites, deleteFavorites } from "../../redux/actions/favorites";
import { toggleClose, toggleOpen } from "../../redux/actions/edit";

// CustomBtn
import { customBtn } from "../../children_components/customBtns";
import { Istate } from "../../ts/types";

const Favorite = createStackNavigator()

const FavoritesScreen: FC = (props) => {
    
    const dispatch = useDispatch()
    const nav = useNavigation()
    const allFavs = useSelector((state: Istate) => state.favs)
    const isEdit = useSelector((state: Istate) => state.editMode)
    const [selectedItems, setSelectedItems] = useState<string[]>([])

    useEffect(() => {

        const unsubscribe = nav.addListener('focus', () => {
            dispatch(loadFavorites())
        })

        return unsubscribe
    }, [])

    useEffect(() => {

        !isEdit && setSelectedItems([])
        // !isEdit && setFinalItems([])

    }, [isEdit])

    useEffect(() => {

        if (selectedItems.length === 0) {
            dispatch(toggleClose())
        }

    }, [selectedItems])

    const checkIfExists = (id: string) => {

        nav.setParams({ items: selectedItems })

        if (selectedItems.find(item => item === id)) {

            return setSelectedItems(prev => [...prev.filter(item => item != id)])
            // return setSelectedItems(selectedItems.filter(item => item != id))

        }

        // setSelectedItems([...selectedItems, id])
        setSelectedItems((prev) => [
            ...prev,
            id
        ])

    }

    return (

        <View style={{flex: 1}}>

            { allFavs.length <= 0 && <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'monsMed', color: '#62BD69', fontSize: 18}} > Add some Favorites </Text>
            </View> }

            { isEdit && <View style={styles.itemsNotif}>
                <Text style={{fontFamily: 'monsReg'}} > {selectedItems.length} Items selected </Text>
                <View style={styles.optionsBtns} >
                    <TouchableOpacity onPress={() => {
                        dispatch(deleteFavorites([...selectedItems]))
                        dispatch(toggleClose())
                    }} style={{...styles.optionBtn, backgroundColor: 'red'}} >
                        <Text style={{fontFamily: 'monsReg', color: 'white'}}> Delete </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{...styles.optionBtn, backgroundColor: 'whitesmoke'}} >
                        <Text style={{fontFamily: 'monsReg'}}> Cancel </Text>
                    </TouchableOpacity>
                </View>
            </View> }

            <FlatList style={{paddingTop: 20}} data={allFavs} keyExtractor={item => item.id} renderItem={(item) => {

            const { item: { plantId, name } } = item

            return (
                <TouchableOpacity onPress={() => {
                    !isEdit ? null : checkIfExists(plantId)
                }} onLongPress={() => {

                    dispatch(toggleOpen())
                    isEdit ? null : checkIfExists(plantId)

                }} key={plantId}>

                    <View style={{...styles.button, backgroundColor: selectedItems.filter(plant => plant === plantId).length === 1 ? '#EBEBEB' : "transparent" }} >
                        <Text style={{fontFamily: 'monsReg', color: selectedItems.filter(plant => plant === plantId).length === 1 ? '#62BD69' : 'black' }} > {name} </Text>
                    </View>

                </TouchableOpacity>
            )

            }} />

        </View>

    )

}

export default FavoritesScreen

export const FavScreenNavigator: FC = () => {

    const nav = useNavigation()
    const isEdit = useSelector((state: Istate) => state.editMode)
    const dispatch = useDispatch()

    return (
        <Favorite.Navigator screenOptions={{
            headerStyle: {
                elevation: 0,
                backgroundColor: '#62BD69',
            },
            headerTintColor: 'white'
        }} >
            
            <Favorite.Screen name="chou" initialParams={{
                items: [] as string[]
            }} options={(props) => {

                // console.log(props)
                // const { items } = props.route.params as { items: string[] }

                return {
                    headerTitle: isEdit ? 'Edit Favorites' : 'Favorites',
                    headerTitleAlign: isEdit ? 'left' : 'center',
                    headerTitleStyle: {
                        fontFamily: 'monsBold'
                    },
                    headerLeft: () => {
    
                        return <HeaderButtons HeaderButtonComponent={customBtn} >
                            { isEdit ? <Item title="asdfafasd" iconName="window-close" color="white" onPress={() => {
                                dispatch(toggleClose())
                            }} iconSize={23} /> : <Item title="asdfaf" iconName="menu" color="white" onPress={() => nav.dispatch(DrawerActions.toggleDrawer())} iconSize={25} />}
                        </HeaderButtons>
        
                    }
                    // headerRight: () => {
                    //     return (
                    //         isEdit ? <HeaderButtons HeaderButtonComponent={customBtn} >
                    //         <Item title="asdfaf" iconName="delete" color="white" onPress={() => console.log('asdfsadf')} iconSize={23} />
                    //     </HeaderButtons> : null
                    //     )
                    // }
                }
            }} component={FavoritesScreen} />

        </Favorite.Navigator>
    )

}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 20,
        paddingHorizontal: 10 
    },
    itemsNotif: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        elevation: 2,
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 8
    },
    optionsBtns: {
        marginTop: 10,
        flexDirection: 'row'
    },
    optionBtn: {
        backgroundColor: 'red',
        height: 30,
        justifyContent: 'center',
        width: 70,
        marginHorizontal: 5,
        alignItems: 'center',
        borderRadius: 5
    }
})