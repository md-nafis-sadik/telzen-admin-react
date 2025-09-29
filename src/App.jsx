import { RouterProvider } from "react-router-dom";
import "./App.css";
import useAuthCheck from "./hooks/useAuthCheck";
import { routes } from "./routes/Router";
import AuthLoader from "./components/loaders/AuthLoader";

function App() {
  const Router = routes;
  const authChecked = useAuthCheck();
  return !authChecked ? (
    <AuthLoader></AuthLoader>
  ) : (
    <div>
      <RouterProvider router={Router}></RouterProvider>
    </div>
  );
}

export default App;
