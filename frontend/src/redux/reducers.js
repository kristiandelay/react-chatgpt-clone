const initialState = {
    history: []
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_HISTORY':
        return {
          ...state,
          history: [...state.history, action.payload]
        };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  