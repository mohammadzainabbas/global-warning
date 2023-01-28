export const UPDATE_EMISSIONS = "UPDATE_EMISSIONS";
export const UPDATE_NATURAL_DISASTERS = "UPDATE_NATURAL_DISASTERS";
export const RESET_DATA = "RESET_DATA";

export const updateEmissions = (emissions) => dispatch => {
    dispatch({
        type: UPDATE_EMISSIONS,
        payload: emissions,
    });
};

export const updateNaturalDisasters = (naturalDisasters) => dispatch => {
    dispatch({
        type: UPDATE_NATURAL_DISASTERS,
        payload: naturalDisasters,
    });
};

export const resetData = () => dispatch => {
    dispatch({
        type: RESET_DATA,
    });
};