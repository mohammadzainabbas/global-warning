

export const updateEmissions = (emissions) => dispatch => {
    dispatch({
        type: UPDATE_EMISSIONS,
        emissions,
    });
};