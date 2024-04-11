import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Player from '../../types/types';
import './Players.css';

const Players: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [newPlayerName, setNewPlayerName] = useState<string>('');
    const [servingPlayer, setServingPlayer] = useState<number>(0);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await fetch('http://localhost:3000/player');
            const data = await response.json();
            setPlayers(data?.data);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    const handlePlayerSelection = (playerName: string) => {
        if (selectedPlayers.includes(playerName)) {
            setSelectedPlayers(selectedPlayers.filter(name => name !== playerName));
        } else if (selectedPlayers.length < 2) {
            setSelectedPlayers([...selectedPlayers, playerName]);
        }
    };

    const handleNewPlayerInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPlayerName(event.target.value);
    };

    const handleAddNewPlayer = async () => {
        try {
            await fetch(`http://localhost:3000/player?name=${encodeURIComponent(newPlayerName)}`, {
                method: 'POST'
            });
            setNewPlayerName('');
            fetchPlayers();
        } catch (error) {
            console.error('Error adding new player:', error);
        }
    };

    const isStartGameDisabled = selectedPlayers.length !== 2;

    return (
        <div className='container'>
            <h1>New Game</h1>
            <div>
                <div>
                    <h2 className='text-center'>Selected players</h2>
                    <div className='custom-radio-container'>
                        <div className='custom-radio'>
                            <label key={0}>
                                <input
                                    type="radio"
                                    value={0}
                                    checked={servingPlayer === 0}
                                    onChange={() => setServingPlayer(0)}
                                />
                                <div>
                                    Player 1: {selectedPlayers[0] ? <span className='text-bold'>{selectedPlayers[0]}</span> : 'Select player'}
                                </div>
                                <div className='server-radio'>
                                    Serve first
                                </div>
                            </label>
                        </div>
                        <div className='custom-radio'>
                            <label key={1}>
                                <input
                                    type="radio"
                                    value={1}
                                    checked={servingPlayer === 1}
                                    onChange={() => setServingPlayer(1)}
                                />
                                <div>
                                    Player 2: {selectedPlayers[1] ? <span className='text-bold'>{selectedPlayers[1]}</span> : 'Select player'}
                                </div>
                                <div className='server-radio'>
                                    Serve first
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    {/* <div className='custom-radio'>
                        <label key={1}>
                            <input
                                type="radio"
                                value={0}
                                checked={servingPlayer === 1}
                                onChange={() => setServingPlayer(1)}
                            />Player 2: {selectedPlayers[1] || 'Select player'} {servingPlayer === 1 ? "(Server)" : ""}
                        </label>
                    </div> */}
                </div>
                <div>
                    <h2 className='text-center'>Players List</h2>
                        <div className='custom-checkbox-container'>
                            {players.map(player => (
                                <div key={player.name} className='text-center custom-checkbox'>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedPlayers.includes(player.name)}
                                            disabled={selectedPlayers.length === 2 && !selectedPlayers.includes(player.name)}
                                            onChange={() => handlePlayerSelection(player.name)}
                                        />
                                        {player.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    <div>
                        <h2 className='text-center'>Add new player</h2>
                        <input className='mt-0'type="text" value={newPlayerName} onChange={handleNewPlayerInputChange} />
                        <button className='secondary mt-0' onClick={handleAddNewPlayer}>Create</button>
                    </div>
                </div>
            </div>

            <div>
                <Link to="/">
                    <button className='primary'>Return to Home</button>
                </Link>
                <Link to={`/match?player1=${encodeURIComponent(selectedPlayers[0])}&player2=${encodeURIComponent(selectedPlayers[1])}&servingPlayer=${encodeURIComponent(servingPlayer)}`}>
                    <button className='primary' disabled={isStartGameDisabled}>Start Game</button>
                </Link>
            </div>
        </div>
    );
}

export default Players;
