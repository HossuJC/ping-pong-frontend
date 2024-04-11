import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
    return (
        <div className="container">
            <h1>Welcome to the Ping Pong Point Manager</h1>
            <p>Manage your ping pong games and leaderboard here!</p>
            <div>
                <Link to="/players">
                    <button className='primary'>New Game</button>
                </Link>
                <Link to="/leaderboard">
                    <button className='primary'>Leaderboard</button>
                </Link>
            </div>
        </div>
    );
}

export default Home;
