import InteractiveCoast from './components/InteractiveCoast';

export default function Page() {
  return (
    <>
      <section id="intro" className="hero">
        <h2>Comprendre les formes et dynamiques du littoral</h2>
        <p>
          Le littoral est un syst?me dynamique o? l'?nergie des vagues, les mar?es et le
          transport s?dimentaire fa?onnent en permanence plages, fl?ches littorales et
          estuaires. Cette page propose une synth?se visuelle et une simulation simplifi?e.
        </p>
      </section>

      <section id="processus" className="grid">
        <article>
          <h3>Vagues et ?nergie</h3>
          <p>
            La hauteur des vagues et l'angle d'incidence contr?lent l'?nergie disponible
            pour mobiliser les s?diments. Des vagues plus hautes augmentent l'?rosion
            potentielle tandis qu'un angle oblique favorise le transit longitudinal.
          </p>
        </article>
        <article>
          <h3>Mar?es et profil de plage</h3>
          <p>
            L'amplitude de la mar?e module la zone d'action des vagues et la pente du
            profil de plage. Les macrotidales pr?sentent souvent de larges estrans.
          </p>
        </article>
        <article>
          <h3>Transport s?dimentaire</h3>
          <p>
            Le courant de d?rive littorale r?sulte de la dissipation oblique du d?ferlement.
            Il d?place sable et galets le long du rivage, alimentant fl?ches et cordons.
          </p>
        </article>
      </section>

      <section id="interactive">
        <h2>Simulation simplifi?e</h2>
        <p className="small muted">
          Cette simulation illustre des tendances qualitatives (p?dagogique, non pr?dictive).
        </p>
        <InteractiveCoast />
      </section>

      <section id="glossaire">
        <h2>Glossaire</h2>
        <ul className="glossary">
          <li><strong>D?ferlement</strong>: rupture d'une vague en eau peu profonde.</li>
          <li><strong>D?rive littorale</strong>: courant parall?le ? la c?te induit par un d?ferlement oblique.</li>
          <li><strong>Fl?che littorale</strong>: saillie sableuse form?e par accumulation longitudinale.</li>
          <li><strong>Estran</strong>: zone comprise entre basse et haute mer.</li>
        </ul>
      </section>
    </>
  );
}
