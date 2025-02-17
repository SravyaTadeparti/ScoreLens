import React from 'react';
import "./LandingPage.css";
import NavBar from './NavBar';


const LandingPage = () => {
    return(
        <div>
            <div className='landing-page'>
                <NavBar />
                <div className='section' id="section-1">
                    <div className="section-1-left">
                        <div className="section-1-left-title">
                            <p>Visualise your </p>
                            <p id="scorelens-name">SCORES</p>
                        </div>
                    </div>
                    <div className="section-1-right"></div>

                </div>
                <img id="wave" src="/wave.svg" alt="wave"></img>

                <div className='section' id="section-2">

                </div>
                <div className='section' id="section-3">

                </div>                

            </div>
        </div>
    );
}

export default LandingPage;