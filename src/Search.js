import {useState, useContext} from "react";
import {AppContext} from "./App";

export default ()  => {
    const [input, setInput] = useState('');
    const context = useContext(AppContext);

    return (
        <form onSubmit={() => {
            context.setUser(input);
            setInput('');
        }}>
            <h2>Enter login from Github</h2>
            <input
                type='text'
                placeholder='Type login'
                required
                minLength={3}
                value={input}
                onChange={e => {
                    setInput(e.target.value);
                }}
            />
            <button className='search' type='submit'>Submit</button>
        </form>
    )
}
