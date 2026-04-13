import LegalPage from '@/components/LegalPage';

export default function Integritetspolicy() {
  return (
    <LegalPage
      title="Integritetspolicy"
      seoTitle="Integritetspolicy | Coffee Code Studio"
      seoDescription="Så hanterar Coffee Code Studio dina personuppgifter enligt GDPR."
    >
      <p className="text-xs text-muted-foreground italic">Senast uppdaterad: 2 april 2026</p>

      <p>
        Coffee Code Studio, enskild firma med säte i Göteborg, är personuppgiftsansvarig för behandlingen av dina personuppgifter. Vi värnar om din integritet och behandlar alltid dina uppgifter i enlighet med EU:s dataskyddsförordning (GDPR).
      </p>

      <h2>1. Vilka uppgifter samlar vi in?</h2>
      <p>Vi samlar in uppgifter som du frivilligt lämnar till oss:</p>
      <ul>
        <li><strong>Kontaktuppgifter</strong> — namn, e-postadress, företagsnamn (via kontaktformuläret)</li>
        <li><strong>Projektinformation</strong> — beskrivning av ditt projekt och dina behov</li>
        <li><strong>Kontouppgifter</strong> — e-post och lösenord (för kunder med kundportal)</li>
        <li><strong>IP-adress</strong> — registreras vid digital signering av projektavtal och publiceringsavtal för att säkerställa avtalets giltighet</li>
      </ul>

      <h2>2. Varför behandlar vi dina uppgifter?</h2>
      <ul>
        <li>För att besvara förfrågningar via kontaktformuläret (rättslig grund: berättigat intresse)</li>
        <li>För att leverera tjänster och projekt (rättslig grund: fullgörande av avtal)</li>
        <li>För att ge dig tillgång till kundportalen (rättslig grund: fullgörande av avtal)</li>
        <li>För att dokumentera digital signering av avtal, inklusive IP-adress (rättslig grund: berättigat intresse — att kunna verifiera avtalets äkthet)</li>
      </ul>

      <h2>3. Hur länge sparar vi uppgifterna?</h2>
      <p>
        Kontaktförfrågningar sparas i högst 12 månader. Kunduppgifter sparas under avtalets löptid samt i 36 månader därefter för eventuella reklamationsärenden. Bokföringsmaterial sparas i 7 år enligt bokföringslagen. IP-adresser kopplade till signerade avtal sparas under avtalets lagringstid.
      </p>

      <h2>4. Delning med tredje part</h2>
      <p>
        Vi delar aldrig dina uppgifter med tredje part i marknadsföringssyfte. Uppgifter kan delas med:
      </p>
      <ul>
        <li><strong>Databasplattform</strong> — vi använder Supabase som databasplattform för att lagra och hantera data. Dataskyddsavtal (DPA) med Supabase aktiveras via deras officiella inställningar under Legal i kontopanelen, i enlighet med GDPR artikel 28.</li>
        <li><strong>Hosting</strong> — Lovable för hosting och driftsättning av webbplatsen</li>
        <li><strong>E-posttjänster</strong> — Resend (resend.com) används för att skicka transaktionella e-postmeddelanden som bekräftelser, avtalsinbjudningar och kundkommunikation</li>
      </ul>
      <p>Alla leverantörer är bundna av dataskyddsavtal (DPA).</p>

      <h2>5. Automatiserat beslutsfattande</h2>
      <p>
        Vi använder inte automatiserat beslutsfattande eller profilering som har rättsliga effekter för dig eller på liknande sätt väsentligt påverkar dig (GDPR artikel 22).
      </p>

      <h2>6. Dina rättigheter</h2>
      <p>Du har rätt att:</p>
      <ul>
        <li>Begära tillgång till dina personuppgifter</li>
        <li>Begära rättelse av felaktiga uppgifter</li>
        <li>Begära radering av dina uppgifter</li>
        <li>Begära begränsning av behandling</li>
        <li>Invända mot behandling baserad på berättigat intresse</li>
        <li>Begära dataportabilitet</li>
      </ul>
      <p>
        Kontakta oss på <a href="mailto:hej@coffeecodestudio.se">hej@coffeecodestudio.se</a> för att utöva dina rättigheter. Vi besvarar din begäran inom 30 dagar.
      </p>

      <h2>7. Klagomål</h2>
      <p>
        Om du anser att vi behandlar dina uppgifter i strid med GDPR har du rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY), <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer">www.imy.se</a>.
      </p>

      <h2>8. Kontakt</h2>
      <p>
        Coffee Code Studio<br />
        Göteborg, Sverige<br />
        E-post: <a href="mailto:hej@coffeecodestudio.se">hej@coffeecodestudio.se</a>
      </p>

      <p className="text-xs text-muted-foreground italic mt-8">Senast uppdaterad: 2 april 2026</p>
    </LegalPage>
  );
}
