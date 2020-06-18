import React from 'react'
import { Link } from 'react-router-dom'

import { FiLogIn } from 'react-icons/fi'
import './homeST.css'

import logo from '../../assets/logo.svg'

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta" />
                </header>

                <main>
                    <h1> Seu marketplace para coletar Resíduos</h1>
                    <p> Ajudamos pessoas a encontrarem pontos de coleta</p>
                    <Link to='/create-point'>
                        <span>
                             <FiLogIn />
                        </span>
                        <strong> Cadastre um ponto para coletar</strong>
                    </Link>
                </main>
                
            </div>
        </div>
    )

}


export default Home