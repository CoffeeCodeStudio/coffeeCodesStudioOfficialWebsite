import LegalPage from '@/components/LegalPage';

export default function Cookiepolicy() {
  return (
    <LegalPage
      title="Cookiepolicy"
      seoTitle="Cookiepolicy | Coffee Code Studio"
      seoDescription="Information om hur Coffee Code Studio använder cookies."
    >
      <p className="text-xs text-muted-foreground italic">Senast uppdaterad: 2 april 2026</p>

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

      <h2>3. Lokal lagring (localStorage)</h2>
      <p>
        Utöver cookies använder vi webbläsarens lokala lagring (localStorage) för att spara viss information direkt på din enhet. Denna data skickas inte automatiskt till våra servrar. Vi lagrar följande:
      </p>
      <ul>
        <li><strong>ccs-cookie-consent</strong> — ditt val gällande cookies (accepterat/avböjt)</li>
        <li><strong>Autentiseringstoken</strong> — sessionsinformation för inloggade användare i kundportalen (hanteras av vår autentiseringsleverantör)</li>
        <li><strong>Språkval</strong> — ditt val av språk på webbplatsen</li>
      </ul>
      <p>
        Du kan rensa localStorage via din webbläsares utvecklarverktyg eller inställningar. Observera att rensning av autentiseringsdata loggar ut dig från kundportalen.
      </p>

      <h2>4. Tredjepartscookies</h2>
      <p>
        Vi använder Google Analytics 4 för att samla in anonymiserad statistik om hur besökare använder webbplatsen. Detta hjälper oss att förbättra innehållet och användarupplevelsen. Google Analytics använder cookies för att känna igen återkommande besökare och analysera trafikmönster. Informationen som genereras av dessa cookies överförs till och lagras av Google på servrar i USA och andra länder. Google använder denna information för att utvärdera användningen av webbplatsen och sammanställa rapporter. Google kan även överföra denna information till tredje part om det krävs enligt lag. Läs mer i{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Googles integritetspolicy</a>.
      </p>
      <p>
        Dessa cookies placeras endast om du aktivt accepterar cookies i vår cookie-banner.
      </p>

      <h2>5. Hur hanterar du cookies?</h2>
      <p>
        Du kan när som helst hantera eller radera cookies via din webbläsares inställningar. Observera att blockering av nödvändiga cookies kan påverka webbplatsens funktionalitet.
      </p>
      <p>Instruktioner för vanliga webbläsare:</p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/sv/kb/cookies-information-webbplatser-sparar-pa-din-dator" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/sv-se/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
      </ul>

      <h2>6. Kontakt</h2>
      <p>
        Har du frågor om vår användning av cookies? Kontakta oss på{' '}
        <a href="mailto:hej@coffeecodestudio.se">hej@coffeecodestudio.se</a>.
      </p>
    </LegalPage>
  );
}
