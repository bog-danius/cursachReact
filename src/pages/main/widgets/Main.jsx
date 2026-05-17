import styles from './Main.module.css';

import { Header } from '@shared/Header';
import { Footer } from '@shared/Footer';

import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { TournamentSection } from '../components/TournamentSection';

export const Main = () => {
	return (
		<div className={styles.page}>
			<Header />

			<main>
				<HeroSection />
				<FeaturesSection />
				<TournamentSection />
			</main>

			<Footer />
		</div>
	);
};