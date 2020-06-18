import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, SafeAreaView, Linking } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import api from '../../services/api'
import * as MailComposer from 'expo-mail-composer'

import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import detailST from './detailST'

interface Params {
    point_id: number;
}

interface Data {
    point: {
        img: string
        img_url: string
        name: string
        email: string
        whatsapp: string
        city: string
        uf: string
    }
    items: {
        title: string
    }[]
}


const Detail = () => {

    const [data, setData] = useState<Data>({} as Data)

    const navigation = useNavigation()

    const route = useRoute()

    const routeParams = route.params as Params

    useEffect(() => {
        api.get(`points/${routeParams.point_id}`).then(response => {
            setData(response.data)
        })
    }, [])


    function handleNavigationBack() {
        navigation.goBack()
    }

    function handleComposeMail() {
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de resíduos',
            recipients: [data.point.email],
        })
    }

    function handleWhatsapp() {
        Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos.`)
    }

    if (!data.point) {
        return null
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={detailST.container}>
                <TouchableOpacity onPress={handleNavigationBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Image style={detailST.pointImage} source={{ uri: data.point.img_url }} />

                <Text style={detailST.pointName}> {data.point.name} </Text>
                <Text style={detailST.pointItems}>
                    {data.items.map(item => item.title).join(', ')}
                </Text>

                <View style={detailST.address}>
                    <Text style={detailST.addressTitle}> Adress </Text>
                    <Text style={detailST.addressContent}> {data.point.city}, {data.point.uf}  </Text>
                </View>
            </View>

            <View style={detailST.footer}>
                <RectButton style={detailST.button} onPress={handleWhatsapp}>
                    <FontAwesome name='whatsapp' size={20} color="#fff" />
                    <Text style={detailST.buttonText}> Zapper </Text>
                </RectButton>

                <RectButton style={detailST.button} onPress={handleComposeMail}>
                    <Icon name="mail" size={20} color="#fff" />
                    <Text style={detailST.buttonText}> E-mail </Text>
                </RectButton>
            </View>
        </SafeAreaView>
    )
}


export default Detail