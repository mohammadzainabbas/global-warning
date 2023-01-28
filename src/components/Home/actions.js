
export const UPDATE_EMISSIONS = "UPDATE_EMISSIONS";

export const updateEmissions = (emissions) => dispatch => {
    dispatch({
        type: UPDATE_EMISSIONS,
        emissions,
    });
};