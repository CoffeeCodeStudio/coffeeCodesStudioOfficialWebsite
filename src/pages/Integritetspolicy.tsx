import LegalPage from '@/components/LegalPage';

export default function Integritetspolicy() {
  return (
    <LegalPage
      title="Integritetspolicy"
      seoTitle="Integritetspolicy | Coffee Code Studio"
      seoDescription="Så hanterar Coffee Code Studio dina personuppgifter enligt GDPR."
    >
      <p className="text-xs text-muted-foreground italic">Senast uppdaterad: 13 april 2026</p>

      <p>
        Coffee Code Studio värnar om din personliga integritet. Denna integritetspolicy förklarar hur vi samlar in, använder och skyddar dina personuppgifter när du besöker vår webbplats eller använder våra tjänster.
      </p>

      <h2>1. Personuppgiftsansvarig</h2>
      <p>
        Coffee Code Studio (Rami) är personuppgiftsansvarig. Kontakt: <a href="mailto:hej@coffeecodestudio.se">hej@coffeecodestudio.se</a>
      </p>

      <h2>2. Vilka uppgifter samlar vi in?</h2>
      <p>
        Uppgifter du själv lämnar via kontaktformuläret: namn, företag (valfritt), e-post, projekttyp, budget, meddelande. Teknisk information via cookies efter samtycke – se{' '}
        <a href="/cookiepolicy">Cookiepolicy</a>.
      </p>

      <h2>3. Syfte och laglig grund</h2>
      <ul>
        <li>Kontakta dig (samtycke)</li>
        <li>Offert/svar (berättigat intresse)</li>
        <li>Förbättra webbplatsen (samtycke via cookies)</li>
      </ul>

      <h2>4. Hur länge sparar vi uppgifterna?</h2>
      <p>
        Formulärsvar sparas max 12 månader efter avslutat ärende, vid kundförhållande gäller bokföringslagen. Cookies och analysdata enligt cookiepolicy.
      </p>

      <h2>5. Vem delar vi uppgifterna med?</h2>
      <ul>
        <li><strong>Supabase</strong> — lagring inom EU</li>
        <li><strong>Google Analytics 4</strong> — webbstatistik, IP-anonymisering</li>
      </ul>
      <p>Vi säljer eller hyr inte ut uppgifter.</p>

      <h2>6. Dina rättigheter</h2>
      <p>Du har rätt till:</p>
      <ul>
        <li>Registerutdrag</li>
        <li>Rättelse</li>
        <li>Radering</li>
        <li>Begränsning</li>
        <li>Invändning</li>
        <li>Återkallande av samtycke</li>
      </ul>
      <p>
        Kontakta <a href="mailto:hej@coffeecodestudio.se">hej@coffeecodestudio.se</a>. Klagomål kan lämnas till <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer">IMY</a>.
      </p>

      <h2>7. Ändringar</h2>
      <p>
        Vi uppdaterar policyn vid behov. Aktuell version finns alltid här.
      </p>
    </LegalPage>
  );
}
