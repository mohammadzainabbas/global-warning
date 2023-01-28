let store = null;

if (process.env.NODE_ENV === "production") {
    
} else {
    // module.exports = require("./configureStore.dev");
    store = dev;
}

export default store;