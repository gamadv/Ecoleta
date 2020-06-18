import React, { useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import {
    View, ImageBackground, Text, Image, TextInput,
    KeyboardAvoidingView, Platform
} from 'react-native';

import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

import homeST from './homeST'
// import logo from '../../assets/logo.png'

const Home = () => {

    const [uf, setUf] = useState('');
    const [city, setCity] = useState('');
    const navigation = useNavigation()

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf,
            city
        });
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }} 
            // behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            behavior="height"
            >
            <ImageBackground
                style={homeST.container}
                source={require('../../assets/home-background.png')}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={homeST.main}>
                    <Image source={require('../../assets/logo.png')} />
                    {/* <Image source={logo}/> OU PODE SER ASSIM */}
                    <Text style={homeST.title}> Seu lugar de coleta de Resíduos</Text>
                    <Text style={homeST.description}> Ajudamos você a encontrar um ponto de coleta mais próximo</Text>
                </View>

                <View style={homeST.footer}>
                    <TextInput
                        style={homeST.input}
                        placeholder="Digite a UF"
                        value={uf}
                        maxLength={2}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        onChangeText={setUf}
                    />

                    <TextInput
                        style={homeST.input}
                        placeholder="Digite a Cidade"
                        value={city}
                        autoCorrect={false}
                        onChangeText={setCity}
                    />
                    <RectButton style={homeST.button} onPress={handleNavigateToPoints}>
                        <View style={homeST.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#fff" size={24} />
                            </Text>
                        </View>
                        <Text style={homeST.buttonText}>
                            Entrar
                    </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

export default Home