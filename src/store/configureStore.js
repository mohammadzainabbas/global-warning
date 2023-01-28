import dev from "./configureStore.dev";
import pro from "./configureStore.prod";

const store = process.env.NODE_ENV === "production" ? pro : dev;

export default store;