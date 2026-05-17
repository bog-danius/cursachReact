
import { Main } from '@pages/main';
import { TournamentsPage } from '@pages/tournaments';
import { AuthPage } from '@pages/auth';


import { Routes, Route } from "react-router-dom";

export const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/TournamentsPage" element={<TournamentsPage />} />
                <Route path="/AuthPage" element={<AuthPage />} />
            </Routes>
        </>
    );
};