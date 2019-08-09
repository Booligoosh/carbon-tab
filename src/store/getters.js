export const foo = state => state.foo;
export const CO2Levels = state => state.CO2Levels;
export const currentCO2 = state => Object.keys(state.CO2Levels).length > 0 ? state.CO2Levels[Object.keys(state.CO2Levels).reverse()[0]].trend || -1 : -1;
