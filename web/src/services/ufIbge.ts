import axios from 'axios'

const ufIbge = axios.create ({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades/'
})

export default ufIbge