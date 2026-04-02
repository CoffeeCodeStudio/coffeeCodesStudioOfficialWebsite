import LegalPage from '@/components/LegalPage';

export default function Anvandardvillkor() {
  return (
    <LegalPage
      title="Användarvillkor"
      seoTitle="Användarvillkor | Coffee Code Studio"
      seoDescription="Allmänna villkor för Coffee Code Studios tjänster."
    >
      <p className="text-xs text-muted-foreground italic">Senast uppdaterad: 2 april 2026</p>

      <p>
        Dessa användarvillkor gäller för alla tjänster som tillhandahålls av Coffee Code Studio, enskild firma med säte i Göteborg.
      </p>

      <h2>1. Tjänster</h2>
      <p>
        Coffee Code Studio erbjuder webbutvecklingstjänster inklusive, men inte begränsat till, MVP-utveckling, prototypning, webbapplikationer och löpande underhåll via månadspaket.
      </p>

      <h2>2. Avtal och beställning</h2>
      <p>
        Ett avtal anses ingånget när båda parter skriftligen (inklusive via e-post eller digital signering i kundportalen) bekräftat projektets omfattning, pris och leveranstid. Muntliga överenskommelser bekräftas alltid skriftligen.
      </p>

      <h2>3. Digital signering</h2>
      <p>
        Avtal kan signeras digitalt via vår kundportal. Vid digital signering registreras signerarens namn, tidpunkt och IP-adress för att säkerställa avtalets giltighet och spårbarhet. Digital signering via kundportalen anses juridiskt bindande i enlighet med lag (2000:832) om kvalificerade elektroniska signaturer och eIDAS-förordningen.
      </p>

      <h2>4. Priser och betalning</h2>
      <ul>
        <li>Alla priser anges i svenska kronor (SEK) exklusive moms om inget annat anges.</li>
        <li>Faktura skickas enligt överenskommelse, normalt vid projektstart eller månadsvis.</li>
        <li>Betalningsvillkor: 15 dagar netto om inget annat avtalats.</li>
        <li>Vid försenad betalning utgår dröjsmålsränta enligt räntelagen.</li>
      </ul>

      <h2>5. Leverans och godkännande</h2>
      <p>
        Leveranstid anges i offerten. Kunden har 14 dagar efter leverans att granska och godkänna resultatet. Mindre justeringar inom projektets omfattning ingår. Uteblir svar anses leveransen godkänd.
      </p>

      <h2>6. Ångerrätt</h2>
      <p>
        Om du som konsument ingår avtal på distans (t.ex. via e-post eller kundportalen) har du enligt distansavtalslagen (2005:59) rätt att ångra köpet inom 14 dagar från avtalets ingående, utan att ange något skäl.
      </p>
      <p>
        Ångerrätten gäller <strong>inte</strong> om tjänsten har påbörjats med ditt uttryckliga samtycke och du har godkänt att ångerrätten går förlorad när tjänsten har fullgjorts. Vid beställning av skräddarsydda digitala produkter kan ångerrätten vara begränsad i enlighet med undantagen i distansavtalslagen.
      </p>
      <p>
        För att utöva din ångerrätt, kontakta oss på <a href="mailto:hej@coffeecodestudio.se">hej@coffeecodestudio.se</a> inom ångerfristen.
      </p>

      <h2>7. Ändringar och tillägg</h2>
      <p>
        Önskemål utanför den överenskomna projektbeskrivningen hanteras som tilläggsarbete och offereras separat. Ändringar bekräftas skriftligen innan arbete påbörjas.
      </p>

      <h2>8. Immateriella rättigheter</h2>
      <ul>
        <li>Vid full betalning överförs alla rättigheter till den levererade produkten till kunden.</li>
        <li>Coffee Code Studio förbehåller sig rätten att använda projektet som referens i portfölj och marknadsföring, om inget annat avtalats.</li>
        <li>Tredjepartsbibliotek och open source-komponenter lyder under sina respektive licenser.</li>
      </ul>

      <h2>9. Ansvarsbegränsning</h2>
      <p>
        Coffee Code Studio ansvarar inte för indirekta skador, utebliven vinst eller förlust av data. Det totala skadeståndsansvaret är begränsat till det belopp kunden betalat för den aktuella tjänsten.
      </p>

      <h2>10. Sekretess</h2>
      <p>
        Båda parter förbinder sig att behandla all konfidentiell information som framkommer under samarbetet med sekretess. Denna skyldighet gäller även efter avtalets upphörande.
      </p>

      <h2>11. Månadspaket</h2>
      <ul>
        <li>Månadspaket löper utan bindningstid och kan sägas upp med 30 dagars varsel.</li>
        <li>Ej nyttjade ärenden under en månad överförs inte till nästa period.</li>
        <li>Coffee Code Studio förbehåller sig rätten att justera priser med 30 dagars förvarning.</li>
      </ul>

      <h2>12. Force majeure</h2>
      <p>
        Ingen part ansvarar för förseningar orsakade av omständigheter utanför partens kontroll, såsom naturkatastrofer, krig, pandemi, myndighetsåtgärder eller liknande.
      </p>

      <h2>13. Tvister</h2>
      <p>
        Eventuella tvister ska i första hand lösas genom förhandling. Om parterna inte kan enas ska tvisten avgöras av svensk domstol med Göteborgs tingsrätt som första instans. Svensk lag tillämpas.
      </p>

      <h2>14. Kontakt</h2>
      <p>
        Coffee Code Studio<br />
        Göteborg, Sverige<br />
        E-post: <a href="mailto:hej@coffeecodestudio.se">hej@coffeecodestudio.se</a>
      </p>
    </LegalPage>
  );
}
