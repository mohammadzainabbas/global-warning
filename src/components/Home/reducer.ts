import { UPDATE_EMISSIONS, UPDATE_NATURAL_DISASTERS } from "./actions";

export const reducer = (state: any = [], action: any) => {
	switch (action.type) {
		case UPDATE_EMISSIONS: {
			return {
				...state,
				...action.payload,
			};
		}
		case UPDATE_NATURAL_DISASTERS: {
			return {
				...state,
				...action.payload,
			};
		}

		default:
			return state;
	}
};
