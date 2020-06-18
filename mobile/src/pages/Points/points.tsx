import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as Location from 'expo-location'

import api from '../../services/api'

import { Feather as Icon } from '@expo/vector-icons'
import pointST from './pointST'


interface Item {
    id: number
    title: string
    img_url: string
}

interface Point {
    id: number
    name: string
    img: string
    img_url: string
    latitude: number
    longitude: number

}
interface Params {
    uf: string;
    city: string;
}

const Points = () => {

    const [items, setItems] = useState<Item[]>([])
    const [points, setPoints] = useState<Point[]>([])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const navigation = useNavigation()
    const route = useRoute();
    const routeParams = route.params as Params;

    useEffect(() => {
        async function loadPosition() {
            const { status } = await Location.requestPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Precisamos de sua permissão para obter a localização.');
                return;
            }

            const location = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = location.coords;

            setInitialPosition([
                latitude,
                longitude
            ]);
        }

        loadPosition();
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })

    }, [])

    useEffect(() => {
        api.get('points', {
          params: {
            city: routeParams.city,
            uf: routeParams.uf,
            items: selectedItems
          }
        }).then(response => {
          setPoints(response.data);
        })
      }, [selectedItems])


    function handleNavigationToHome() {
        navigation.goBack()
    }

    function handleNavigationToDetail(id: number) {
        navigation.navigate('Detail', { point_id: id })
    }

    function handleSelectedItem(id: number) {

        const alreadySelected = selectedItems.findIndex(item => item === id)

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        }
        else {
            setSelectedItems([...selectedItems, id])
        }
    }

    return (
        <>
            <View style={pointST.container}>
                <TouchableOpacity>
                    <Icon name="arrow-left" size={20} color="#34cb79" onPress={handleNavigationToHome} />
                </TouchableOpacity>

                <Text style={pointST.title}> Seja muito Bem vindo!</Text>
                <Text style={pointST.description}>Encontre seu ponto de coleta mais acessível</Text>

                <View style={pointST.mapContainer}>
                    {initialPosition[0] !== 0 && (
                        <MapView
                            style={pointST.map}
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                latitudeDelta: 0.014,
                                longitudeDelta: 0.014,
                            }}
                        >
                            {points.map(point => (
                                <Marker
                                    key={String(point.id)}
                                    style={pointST.mapMarker}
                                    onPress={() => handleNavigationToDetail(point.id)}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude,
                                    }}
                                >
                                    <View style={pointST.mapMarkerContainer}>
                                        <Image style={pointST.mapMarkerImage} source={{ uri: point.img_url }} />
                                        <Text style={pointST.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    )}
                </View>
            </View>
            <View style={pointST.itemsContainer}>
                <ScrollView
                    horizontal
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    showsHorizontalScrollIndicator={false}>

                    {items.map(item => (
                        <TouchableOpacity
                            key={String(item.id)}
                            style={[
                                pointST.item,
                                selectedItems.includes(item.id) ? pointST.selectedItem : {}
                            ]}
                            onPress={() => handleSelectedItem(item.id)}
                            activeOpacity={0.7}>
                            <SvgUri width={42} uri={item.img_url} />
                            <Text style={pointST.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            {/* </View> */}
        </>
    )
}


export default Points