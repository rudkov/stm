import './NotificationProvider.css';
import '../../helpers/shared.css';

import { v4 } from "uuid";

import Notification from './Notification';
import { createContext, useReducer, useContext, useCallback } from 'react';

const NotificationContext = createContext();

const NotificationProvider = (props) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "ADD_NOTIFICATION":
                return [...state, {...action.payload}];
            case "REMOVE_NOTIFICATION":
                return state.filter(el => el.id !== action.id);
            default:
                return state;
        }

    }, []);

    return (
        <NotificationContext.Provider value={dispatch}>
            <div className='notification--container text-regular'>
                {state.map(note => {
                    return <Notification dispatch={dispatch} key={note.id} {...note} />
                })}
            </div>
            {props.children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const dispatch = useContext(NotificationContext);

    return useCallback((props) => {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                id: v4(),
                ...props
            }
        })
    }, [dispatch]);
};

export default NotificationProvider;