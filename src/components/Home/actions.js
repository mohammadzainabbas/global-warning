export const UPDATE_EMISSIONS = "UPDATE_EMISSIONS";
export const UPDATE_NATURAL_DISASTERS = "UPDATE_NATURAL_DISASTERS";

export const updateEmissions = (emissions) => dispatch => {
    dispatch({
        type: UPDATE_EMISSIONS,
        emissions,
    });
};

export const updateNaturalDisasters = (naturalDisasters) => dispatch => {
    dispatch({
        type: UPDATE_EMISSIONS,
        emissions,
    });
};