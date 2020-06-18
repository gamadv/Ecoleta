import axios from 'axios'

const cityIbge = axios.create ({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/'
})

export default cityIbge