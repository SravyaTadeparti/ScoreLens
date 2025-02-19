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
                        <p id="section-1-left-paragraph">Track your scores and watch progress come to life with clear, easy-to-read visualizations. Whether you're a professor managing student performance or a student tracking your own achievements, simply enter your scores and get dynamic charts that show how you're doing. Stay on top of your goals with all the insights you need, whether you're looking to improve or just keeping track.</p>
                    </div>
                    <div className="section-1-right">
                        <img className="graph" id="graph1" src="/graph1.png" alt="graph1"></img>
                        <img className="graph" id="graph2" src="/graph2.png" alt="graph1"></img>
                    </div>

                </div>

                <img id="wave" src="/wave.svg" alt="wave"></img>

                <div className='section' id="features-page">
                    <div className='page-title'>Features</div>
                    <div className='features-container'>
                        <div className='feature'></div>
                        <div className='feature'></div>
                        <div className='feature'></div>
                    </div>
                </div>
                <div className='section' id="analytics-page">
                    <div className='page-title'>Analytics</div>
                    <div className='analytics-grid'>
                        <div className='analytics-box' id='box-1'>
                            Bar graph
                            <img className="analytics-image" id='image-1' src='/graph1.png'></img>
                        </div>
                        <div className='analytics-box' id='box-2'>
                            Bell curve
                            <img className="analytics-image" id='image-2' src='/graph2.png'></img>
                        </div>
                        <div className='analytics-box' id='box-3'>
                            Line graph
                            <img className="analytics-image" id='image-3' src='/graph3.png'></img>
                        </div>
                        <div className='analytics-box' id='box-4'>
                            Scattered graph
                            <img className="analytics-image" id='image-4' src='/graph4.png'></img>
                        </div>
                    </div>
                </div>                

            </div>
        </div>
    );
}

export default LandingPage;