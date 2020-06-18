import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import Dropzone from '../../components/Dropzone/dropZone'

import api from '../../services/api'
import ufIbge from '../../services/ufIbge'
import cityIbge from '../../services/cityIbge'

import { FiArrowLeft } from 'react-icons/fi'
import './createPointST.css'
import logo from '../../assets/logo.svg'

interface Item {
    id: number;
    title: string;
    img_url: string
}
interface IBGEUFresponse {
    sigla: string
}
interface IBGECityresponse {
    nome: string
}

const CreatePoint: React.FC = () => {

    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])

    const [inicialPosition, setInicialPosition] = useState<[number, number]>([0, 0])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',

    })

    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords

            setInicialPosition([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {
        ufIbge.get<IBGEUFresponse[]>('estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)

            setUfs(ufInitials)
        })

    }, [])

    useEffect(() => {
        if (selectedUf === "0") {
            return;
        }

        cityIbge
            .get<IBGECityresponse[]>(`${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome)

                setCities(cityNames)
            })
    }, [selectedUf])


    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value

        setSelectedUf(uf)

    }
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value

        setSelectedCity(city)

    }

    function handleMapClick(event: LeafletMouseEvent) {

        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])

    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {

        const { name, value } = event.target

        setFormData({ ...formData, [name]: value })
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

    async function handleSubmit(event: FormEvent) {

        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const dataFinal = new FormData();

        dataFinal.append('name', name);
        dataFinal.append('email', email);
        dataFinal.append('whatsapp', whatsapp);
        dataFinal.append('uf', uf);
        dataFinal.append('city', city);
        dataFinal.append('latitude', String(latitude));
        dataFinal.append('longitude', String(longitude));
        dataFinal.append('items', items.join(','));

        if (selectedFile) {
            dataFinal.append('img', selectedFile);
          }

        await api.post('points', dataFinal)

        alert('Ponto de coleta criado com Sucesso!')

        history.push('/')
    }

    return (
        <div id="page-create-point">
            <header>
                <Link to="/">
                    <img src={logo} alt="Ecoleta" />
                </Link>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1> Cadastro <br></br>do Ponto</h1>

                <Dropzone onFileUploaded={setSelectedFile} />


                <fieldset>
                    <legend>
                        <h2> Dados </h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name"> Nome da Grupo</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange} />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name"> Email </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="name"> Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2> Endereço </h2>
                        <span> Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={inicialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf"> Estado (UF) </label>
                            <select
                                name="uf"
                                id="uf"
                                value={selectedUf}
                                onChange={handleSelectUf}>
                                <option value='0'> Selecione uma UF </option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>

                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city"> Cidade </label>
                            <select
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity}
                            >
                                <option value='0'> Selecione uma Cidade </option>
                                {cities.map(city =>
                                    <option key={city} value={city}>{city}</option>
                                )}                                }
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2> Itens de Coleta </h2>
                        <span> Selecione 1 ou + itens</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(items => (
                            <li
                                key={items.id}
                                onClick={() => handleSelectedItem(items.id)}
                                className={selectedItems.includes(items.id) ? 'selected' : ''}>
                                <img src={items.img_url} alt={items.title} />
                                <span> {items.title}</span>
                            </li>

                        ))}
                    </ul>
                </fieldset>
                <button type="submit">
                    Cadastrar ponto.
                </button>
            </form>
        </div >
    )
}


export default CreatePoint