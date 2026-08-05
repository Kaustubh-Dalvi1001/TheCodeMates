import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Feed from "./components/Feed";
import Body from "./components/Body";
import Profile from "./components/Profile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import appstore from "./store/appStore";
import { ToastContainer } from "react-toastify";
import Connections from "./components/Connections";
import ReceivedConnections from "./components/ReceivedConnections";
import SentConnectionRequests from "./components/SentConnectionRequests";

function App() {
  const queryClient = new QueryClient();

  return (
    <div>
      <Provider store={appstore}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename="/">
            <ToastContainer />
            <Routes>
              <Route path="/" element={<Body />}>
                <Route path="/feed" element={<Feed />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/receivedConnections" element={<ReceivedConnections />} />
                <Route path="/SentConnectionRequest" element={<SentConnectionRequests />} />
              </Route>
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </div>
  );
}

export default App;
