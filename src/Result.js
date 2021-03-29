import {useContext, useState, useEffect, useReducer} from "react";
import {AppContext} from "./App";
import axios from "axios";
import {Table} from "react-bootstrap";
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';

const initialState = {
    items: [],
    unsorted: [],
    size: 10,
    page: 1,
    pageItems: [],
    sort: 0
};

function reducer(state, action) {
    switch (action.type) {
        case 'setItems': return set(state, action.payload);
        case 'sortItems': return sort(state);
        case 'paging': return paging(state);
        case 'pageNext': return pagingNext(state);
        case 'pagePrev': return pagingPrev(state);
        default: throw new Error();
    }
}

function set(state, items){
    return {...state, items: items, unsorted: items.slice()};
}

function sort(state) {
    switch (state.sort) {
        case 0: return {...state, sort: state.sort + 1, items: state.items.sort(
                    (a,b) => {return a.login.toLowerCase() > b.login.toLowerCase() ? 1 : -1;})};
        case 1: return {...state, sort: state.sort + 1, items: state.items.sort(
                        (a,b) => {return a.login.toLowerCase() > b.login.toLowerCase() ? -1 : 1;})};
        case 2: return {...state, sort: 0, items: state.unsorted.slice()};
        default: return state;
    }
}

function paging(state) {
    return {...state, pageItems: state.items.slice(0, state.size), page: 1};
}

function pagingPrev(state) {
    if (state.page  < 2) {
        return;
    }
    const start = (state.page - 2) * state.size;
    return {...state, pageItems: state.items.slice(start, start + state.size), page: state.page - 1};
}

function pagingNext(state) {
    const start = state.page * state.size;
    if (state.items.length < start) {
        return;
    }
    return {...state, pageItems: state.items.slice(start, start + state.size), page: state.page + 1};
}

export default () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const context = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = 'https://api.github.com/search/users';
    const headers = ['№', 'Avatar', 'Login', 'Type'];

    useEffect(() => {
        axios.get(url, {
            params: {
                q: context.user
            }
        })
            .then(function (response) {
                if (response.data.items) {
                    return dispatch({type: 'setItems', payload: response.data.items});
                }
                throw new Error(`Request error: status: ${error}`);
            })
            .catch(function (error) {
                setError(error);
            })
            .then(function () {
                dispatch({type: 'paging'});
                setIsLoading(false);
            })
    }, [])

    useEffect(() => {
        return dispatch({type: 'paging'});
    }, [state.sort]);

    if (error) {
        return <div className='error'><h2>{error.message}</h2></div>;
    } else if (isLoading) {
        return <div className='loader'/>;
    } else {
        return (
            <>
            <Table striped bordered hover responsive="sm">
                <thead>
                <tr>
                    {headers.map((h,i) => <th class="align-middle" key={i}>{h}
                        {i === 2 ? <button onClick={() => dispatch({type: 'sortItems'})}><SortByAlphaIcon fontSize='small'/></button> : ''}
                    </th>)}
                </tr>
                </thead>
                <tbody>
                 { state.pageItems.map((it, ind) =>
                    <tr key={ind}>
                        <td>{(state.page - 1) * state.size + ind + 1}</td>
                        <td><img src={it.avatar_url} alt={it.avatar_url}/></td>
                        <td>{it.login}</td>
                        <td>{it.type}</td>
                    </tr>)
                }
                </tbody>
            </Table>
                {state.page < 2 ? '' : <button className='page' onClick={() => dispatch({type: 'pagePrev'})}>{state.page - 1}</button>}
                <button className='page' disabled={true}>{state.page}</button>
                {state.page >= state.items.length / state.size? '' : <button className='page' onClick={() => dispatch({type: 'pageNext'})}>{state.page + 1}</button>}
                </>
        );
    }
}
