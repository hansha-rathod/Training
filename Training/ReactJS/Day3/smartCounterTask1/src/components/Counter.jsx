import { useReducer, useRef } from 'react';
import './Counter.css';

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { 
                count: state.count + 1 ,
                history: [...(state.history || []), state.count ]

            };
        case 'decrement':
            return { count: Math.max(0, state.count - 1),
                history: [...(state.history || []), state.count ]
             };
        case 'reset':
            return { count: 0, 
                history: [...(state.history || []), state.count ] };
        case 'set_value':
            return { count: Math.max(0, action.payload),
                 history: [...(state.history || []), state.count ] };
        default:
            throw new Error("Unknown action type");
    }
}


function Counter() {

    const [state, dispatch] = useReducer(reducer, { count: 0, history: [] });
    const inputRef = useRef(null);
    const history = useRef([]);

    return (

        <div className="counter">
            <h1>Count: {state.count}</h1>

            <div className="button-group">
                <button className="increment-btn" onClick={() => dispatch({type: "increment"})}>+</button>
                <button className="decrement-btn" onClick={() => dispatch({type: "decrement"})} disabled={state.count === 0}>-</button>
                <button className="reset-btn" onClick={() => dispatch({type: "reset"})}>Reset</button>
            </div>

            <div className="input-group">
                <input
                    ref={inputRef}
                    type="number"
                    placeholder="Enter value"
                    min="0"
                />
                <button className="set-value-btn" onClick={() => dispatch({ type: "set_value", payload: parseInt(inputRef.current.value) || 0})}>
                    Set Value
                </button>
            </div>

            <div className="history-section">
                <h3>History</h3>
                {state.history.length === 0 ? (
                    <p className="empty-history">No history yet. Start counting!</p>
                ) : (
                    <ul className="history-list">
                        {state.history.map((entry, index) => (
                            <li key={index}>
                                <span>Step {index + 1}</span>
                                <span>{entry}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

    )

}

export default Counter;