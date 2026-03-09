import LegalPage from '@/components/LegalPage';

export default function Cookiepolicy() {
  return (
    <LegalPage
      title="Cookiepolicy"
      seoTitle="Cookiepolicy | Coffee Code Studio"
      seoDescription="Information om hur Coffee Code Studio använder cookies."
    >
      <p>
        Denna cookiepolicy förklarar hur Coffee Code Studio använder cookies och liknande tekniker på vår webbplats.
      </p>

      <h2>1. Vad är cookies?</h2>
      <p>
        Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. De används för att webbplatsen ska fungera korrekt och för att förbättra användarupplevelsen.
      </p>

      <h2>2. Vilka cookies använder vi?</h2>

      <h3>Nödvändiga cookies</h3>
      <p>Dessa cookies krävs för att webbplatsen ska fungera och kan inte stängas av. De inkluderar:</p>
      <ul>
        <li><strong>Sessionscookies</strong> — hanterar inloggning i kundportalen</li>
        <li><strong>Cookie-samtycke</strong> — sparar ditt val gällande cookies</li>
      </ul>

      <h3>Funktionella cookies</h3>
      <ul>
        <li><strong>Språkinställning</strong> — sparar ditt val av språk (svenska/engelska)</li>
      </ul>

      <h2>3. Tredjepartscookies</h2>
      <p>
        Vi använder för närvarande inga tredjepartscookies för analys eller marknadsföring. Om detta ändras uppdaterar vi denna policy och ber om ditt samtycke.
      </p>

      <h2>4. Hur hanterar du cookies?</h2>
      <p>
        Du kan när som helst hantera eller radera cookies via din webbläsares inställningar. Observera att blockering av nödvändiga cookies kan påverka webbplatsens funktionalitet.
      </p>
      <p>Instruktioner för vanliga webbläsare:</p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/sv/kb/cookies-information-webbplatser-sparar-pa-din-dator" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/sv-se/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
      </ul>

      <h2>5. Kontakt</h2>
      <p>
        Har du frågor om vår användning av cookies? Kontakta oss på{' '}
        <a href="mailto:hej@coffeecodestudio.se">hej@coffeecodestudio.se</a>.
      </p>
    </LegalPage>
  );
}
