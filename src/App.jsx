import { Header } from '@shared/Header';
import { Main } from '@pages/main';
import { TournamentsPage } from '@pages/tournaments';
import { Footer } from '@shared/Footer';

import { Routes, Route } from "react-router-dom";

export const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/TournamentsPage" element={<TournamentsPage />} />
            </Routes>
        </>
    );
};