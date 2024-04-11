import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Player from '../../types/types';
import './Leaderboard.css';

const Leaderboard: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('http://localhost:3000/leaderboard');
            const data = await response.json();
            setPlayers(data?.data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };

    return (
        <div className='container'>
            <h1>Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Wins</th>
                        <th>Cumulative Points</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{player.name}</td>
                            <td>{player.wins}</td>
                            <td>{player.cumulative_points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/">
                <button className='primary'>Return to Home</button>
            </Link>
        </div>
    );
}

export default Leaderboard;
