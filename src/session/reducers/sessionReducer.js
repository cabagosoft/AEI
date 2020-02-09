export const initialState = {
   user : {
      name:"",
      fullname:"",
      email:"",
      id: "",
      avatar:""
   },
   authenticated: false
}

const sessionReducer = (state = initialState, action) => {
   switch(action.type){
      case "START_SESSION":
         return {
            ...state,
            user : action.session,
            authenticated : action.authenticated
         };
      case "CHANGE_SESSION":
         return {
            ...state,
            user : action.newUser,
            authenticated : action.authenticated
         };
      case "EXIT_SESSION":
         return {
            ...state,
            user : action.newUser,
            authenticated : action.authenticated
         };
      default :
         return state;

   }
}

export default sessionReducer;