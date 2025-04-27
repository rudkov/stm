import React, { useEffect, useState } from 'react';
import './Notification.css';

const Notification = (props) => {

    const [exit, setExit] = useState(false);
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    const handleStartTimer = () => {
        const id = setInterval(() => {
            setTimer( prev => {
                if (prev < 100) {
                    return prev + 1;
                }

                clearInterval(id);
                return prev;
            })
        }, 20);
        setIntervalId(id);
    };

    const handlePauseTimer = () => {
        clearInterval(intervalId);
    };

    const handleCloseNotification = () => {
        setExit(true);
        setTimeout(() => {
            props.dispatch({
                type: "REMOVE_NOTIFICATION",
                id: props.id,
            });
        }, 400);
    };

    useEffect(() => {
        if(timer === 100) {
            handleCloseNotification();
        }
    }, [timer]);

    useEffect(() => {
        handleStartTimer();
    }, []);

    return (
        <div
            onMouseEnter={handlePauseTimer}
            onMouseLeave={handleStartTimer}
            className={`notification--item notification--item-black ${exit ? 'exit' : ''}`}
        >
            {props.message}
        </div>
    );
};

export default Notification;