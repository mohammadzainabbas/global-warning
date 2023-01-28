import { UPDATE_EMISSIONS, UPDATE_NATURAL_DISASTERS, RESET_DATA } from "./actions";

export const reducer = (state: any = [], action: any) => {
	switch (action.type) {
		case UPDATE_EMISSIONS: {
			if 
			return {
				...state,
				data: {
					...state.data,
					emissions: action.payload,
				},
			};
		}
		case RESET_DATA: {
			return {
				...state,
				data: {},
			};
		}
		case UPDATE_NATURAL_DISASTERS: {
			return {
				...state,
				data: {
					...state.data,
					naturalDisasters: action.payload,
				},
			};
		}

		default:
			return { ...state };
	}
};
