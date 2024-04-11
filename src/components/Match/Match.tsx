import React, { useState, useEffect } from 'react';
import Player from '../../types/types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Match.css';

const Match: React.FC = () => {
    const [player1, setPlayer1] = useState<Player | null>(null);
    const [player2, setPlayer2] = useState<Player | null>(null);
    const [player1Score, setPlayer1Score] = useState<number>(0);
    const [player2Score, setPlayer2Score] = useState<number>(0);
    const [server, setServer] = useState<number>(0);
    const [winner, setWinner] = useState<Player | null>(null);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize player names on component mount
    useEffect(() => {
            setPlayer1({ name: searchParams.get("player1") || "Player 1", wins: 0, cumulative_points: 0 });
            setPlayer2({ name: searchParams.get("player2") || "Player 2", wins: 0, cumulative_points: 0 });
            setServer(Number(searchParams.get("servingPlayer") || 0))
    }, [searchParams]);

    // Update winner and end the game if conditions are met
    useEffect(() => {
        if (winner) {
            fetch(`http://localhost:3000/player?name=${winner.name}&wins=1&cumulative_points=${winner === player1 ? player1Score : player2Score}`, {
                method: 'PATCH'
            });
        } else if ((player1Score > 10 || player2Score > 10) && ((player1Score - player2Score) >= 2 || (player2Score - player1Score) >= 2)) {
            setWinner(player1Score > player2Score ? player1 : player2);
        }
    }, [player1Score, player2Score, player1, player2, winner]);

    const handleScoreUpdate = (player: number) => {
        if (!winner) {
            if (player === 1) {
                setPlayer1Score(player1Score + 1);
            } else {
                setPlayer2Score(player2Score + 1);
            }
            switchServer();
        }
    };

    const switchServer = () => {
        if (!winner && (player1Score + player2Score) % 2 === 1) {
            setServer(server === 0 ? 1 : 0);
        }
    };

    const handleGameEnd = () => {
        if (window.confirm('Are you sure you want to end the game?')) {
            navigate('/');
        }
    };

    return (
        <div className='container'>
            <h1>Match:</h1>
            <h1>{player1?.name || 'Player 1'} VS {player2?.name || 'Player 2'}</h1>
            <div>
                <h2 className='text-center'>Scores</h2>
                <div className='player-box'>
                    <div className='player-name'>
                        <span className='text-bold'>{player1?.name || 'Player 1'}</span> {server === 0 && <span className='serving-now'>Serving now</span>}
                    </div>
                    <div>
                        Points: <span className='text-bold'>{player1Score}</span>
                        <button className='secondary' onClick={() => handleScoreUpdate(1)} disabled={!!winner}>Add Point</button>
                    </div>
                </div>
                <div className='player-box'>
                    <div className='player-name'>
                    <span className='text-bold'>{player2?.name || 'Player 2'}</span> {server === 1 && <span className='serving-now'>Serving now</span>}
                    </div>
                    <div>
                        Points: <span className='text-bold'>{player2Score}</span>
                        <button className='secondary' onClick={() => handleScoreUpdate(2)} disabled={!!winner}>Add Point</button>
                    </div>
                </div>
            </div>
            {winner ? (
                <div className='text-center'>
                    <h2>Winner</h2>
                    <p>Player <span className='text-bold'>{winner.name}</span> has won: <span className='text-bold'>{winner?.name === player1?.name ? `${player1Score}-${player2Score}` : `${player2Score}-${player1Score}`}</span></p>
                    <button className='primary' onClick={() => navigate('/leaderboard')}>Continue</button>
                </div>
            ) : (
                <button className='primary' onClick={handleGameEnd} disabled={!!winner}>End Game</button>
            )}
        </div>
    );
}

export default Match;
