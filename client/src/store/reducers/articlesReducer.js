import * as actionTypes from '../actions/actionTypes';

const initialState = {
    articles: [],
    article: {},
    myArticles: {},
    products: [],
    report:[],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GOT_ALL_ARTICLES:
            return {
                ...state,
                articles: action.articles
            };
        case actionTypes.GOT_MY_ARTICLES: {
            return {
                ...state,
                myArticles: action.myArticles
            }
        }
        case actionTypes.GOT_SINGLE_ARTICLE:
            return {
                ...state,
                article: action.article
            };
        case actionTypes.GOT_ALL_PRODUCTS:
            return {
                ...state,
                ...action.products
            };
        case actionTypes.GOT_REPORT:

        console.log(action, "kdfhlhflk")
            return {
                ...state,
                report: action.report
            };
        default:
            return state;
    }
};

export default reducer;
