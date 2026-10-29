import './portfolio.css';
import { PEOPLE } from './people.js';
import { PersonContext } from './lib/person';
import SmoothScroll from './SmoothScroll.jsx';
import { GetInTouchProvider } from './ui/GetInTouch';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Portfolio } from './sections/Portfolio';
import { WorkWithMe } from './sections/WorkWithMe';
import { Services } from './sections/Services';
import { Awards } from './sections/Awards';
import { Clients } from './sections/Clients';
import { Testimonials } from './sections/Testimonials';
import { Faq } from './sections/Faq';
import { Footer } from './sections/Footer';
import { DataStrip } from './sections/DataStrip';
import { DragGallery } from './sections/DragGallery';
import { PersonaFx } from './PersonaFx.jsx';

// Page portfolio d'un membre de l'équipe (#team/<id>), chargée à la demande depuis App.jsx.
export default function PortfolioPage({ id }) {
  const person = PEOPLE[id];
  return (
    <PersonContext.Provider value={person}>
      <div className="pf" data-tone={person.tone} data-persona={person.personality.key} dir="ltr" lang="fr">
        <GetInTouchProvider>
          <SmoothScroll />
          <PersonaFx />
          <Header />
          <Hero />
          {person.personality.kpis && <DataStrip />}
          <Portfolio />
          <WorkWithMe />
          {person.personality.gallery && <DragGallery />}
          <Services />
          <Awards />
          <Clients />
          <Testimonials />
          <Faq />
          <Footer />
        </GetInTouchProvider>
      </div>
    </PersonContext.Provider>
  );
}
