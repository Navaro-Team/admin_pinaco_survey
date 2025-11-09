import { setIsLogged } from "@/features/app/app.slice";
import { storage } from "@/lib/storage.util";
import { Action, Dispatch } from "@reduxjs/toolkit"
export const customMiddleware =
  ({ dispatch, }: { dispatch: Dispatch<Action> }) =>
    (next: (arg0: any) => void) => (action: any) => {
      if (action.payload) {
        const message = action?.payload?.response?.data?.message || action?.payload?.message;
        if (message) {
          if (["Session Expired", "Unauthorized", "No access token"].includes(message)) {
            dispatch(setIsLogged(false));
            storage.clear();
            window.location.replace("/login");
            return;
          }
        }
      }
      next(action);
    }