import { UPDATE_EMISSIONS, UPDATE_NATURAL_DISASTERS } from "./actions";

export const reducer = (state: any = [], action: any) => {
	switch (action.type) {
		case UPDATE_EMISSIONS: 
		return {
			...state,
			forms: {
				...state.forms,
				correspondenceInfo: action.payload,
			}
		};
	}

		default:
			return state;
	}
};
