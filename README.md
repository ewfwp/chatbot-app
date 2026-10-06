# EWFWP / JWZ Chatbot — versie 2.0

De chatbot draait als Angular webcomponent in WordPress. AI-antwoorden worden door een servermodel gemaakt; bezoekers downloaden geen model en hebben geen WebGPU of API-key nodig. Het bestaande JWZ-design, de tag `ewfwp-chatbot-app` en de Elementor-widget blijven behouden.

## Installeren in WordPress

1. Upload **ewfwp-chatbot-app.zip** via **Plugins → Nieuwe plugin → Plugin uploaden**. Dit is het installatiepakket, niet de ZIP met het hele bronproject. Bij een bestaande installatie: vervang de oude plugin en activeer versie 2.0.0.
2. Open de nieuwe beheerpagina **EWFWP Chatbot** in het hoofdmenu van wp-admin.
3. Kies de positie (links boven, rechts boven, links onder of rechts onder), een tekstballon/vraagteken of een eigen SVG-bestand. SVG-code plakken kan ook. Klik op **Instellingen opslaan**.
4. Stel de hieronder beschreven AI-server in en gebruik **Test de opgeslagen AI-instellingen**.
5. Leeg na een update eventuele WordPress/CDN-paginacaches. Test als uitgelogde bezoeker.

Het chatbolletje staat standaard rechtsonder op openbare pagina’s die de normale WordPress `wp_head`/`wp_footer`-hooks gebruiken. Een klik opent een modal. Het chatgesprek blijft bij sluiten en opnieuw openen op dezelfde pagina behouden; bij navigeren/verversen begint een nieuw gesprek.

## Gratis en zonder verplichte API-key: wat is nodig?

De standaardkoppeling gebruikt **een zelf gehoste Ollama-server**, niet een betaalde cloud-API. Er wordt geen key aan bezoekers gevraagd en er zit geen key in de browserbundel. Het WordPress-endpoint voert validatie, contextopbouw, de serveraanvraag en antwoordverwerking uit. **Het taalmodel zelf draait in Ollama, niet in PHP.**

Er moet dus wel ergens voldoende rekenkracht beschikbaar zijn. Gratis software betekent niet automatisch gratis hosting. Op veel shared WordPress-hostingpakketten kun je geen Ollama-proces draaien. Dan heb je een afzonderlijke bereikbare server nodig. Als die niet beschikbaar is, geeft de chatbot een duidelijke foutmelding; er is geen verborgen cloudabonnement of terugval naar statische antwoorden.

### Ollama op dezelfde server als WordPress

Installeer Ollama volgens de [officiële installatie-instructies](https://docs.ollama.com/quickstart). Download op die server bijvoorbeeld het standaard ingestelde model:

```sh
ollama pull qwen2.5:1.5b
```

Zorg dat de Ollama-service draait (`ollama serve` als die niet al als service actief is). Vul in WordPress in:

- Ollama chat-endpoint: `http://127.0.0.1:11434/api/chat`
- Model: `qwen2.5:1.5b`

Dit kleine model is een instelbaar uitgangspunt. Beoordeel zelf de Nederlandse antwoorden en snelheid; grotere modellen kunnen betere antwoorden geven maar vragen meer geheugen/rekenkracht. De modeldownload gebeurt alleen op de AI-server. De eerste vraag kan langer duren doordat het model nog moet worden geladen.

**127.0.0.1 is de WordPress-server.** Dit verwijst niet naar de computer waarop de bezoeker of beheerder zijn browser opent. Draait WordPress in een container, dan is het ook niet automatisch de hostmachine; configureer dan het bereikbare adres van de Ollama-service.

### Ollama op een andere server

Vul het volledige `/api/chat`-adres in dat vanaf de WordPress-server bereikbaar is. Gebruik een privénetwerk/VPN of een beveiligde HTTPS-proxy. Stel de onbeschermde Ollama-poort niet publiek beschikbaar. De browser praat uitsluitend met WordPress.

Een optionele bearer-token voor een eigen beveiligde proxy kan buiten de plugin in `wp-config.php` staan:

```php
define('EWFWP_CHATBOT_OLLAMA_TOKEN', 'token-voor-uw-eigen-proxy');
```

Dit is niet nodig voor de lokale standaardconfiguratie en komt nooit in de frontend. De proxy moet die token zelf controleren. Deze plugin verwacht de **Ollama `/api/chat`-API**, geen willekeurig OpenAI-compatible endpoint.

Referenties: [Ollama chat-API](https://docs.ollama.com/api/chat), [lokale API en authenticatie](https://docs.ollama.com/api/authentication), [model](https://ollama.com/library/qwen2.5:1.5b).

## Op een eigen pagina blijven gebruiken

Bestaande Elementor-pagina’s blijven de widget **Chatbot applicatie** in de categorie **EWFWP Widgets** gebruiken. De interne widgetnaam en script-/stijlhandles zijn behouden. De plugin werkt daarnaast zonder Elementor.

Zet in een WordPress-pagina een shortcodeblok met:

```text
[ewfwp_chatbot]
```

Ook een bestaande HTML-invoeging werkt op dezelfde WordPress-site:

```html
<ewfwp-chatbot-app></ewfwp-chatbot-app>
```

De lichte loader vult het endpoint en de sitetitel in. Op een pagina met een ingebedde chatbot wordt de app direct geladen; op overige pagina’s pas bij klikken op het bolletje. De modal en de pagina kunnen naast elkaar bestaan en hebben elk hun eigen gesprek. Er wordt per document maar één appbundel geladen. Het uitschakelen van het bolletje schakelt de pagina-widget of shortcode niet uit.

De gebouwde `web-component/web-component.js` kan ook handmatig worden geladen, zoals voorheen. Geef dan expliciet het endpoint mee:

```html
<script defer src="/wp-content/plugins/ewfwp-chatbot-app/web-component/web-component.js"></script>
<ewfwp-chatbot-app
  api-endpoint="/wp-json/ewfwp-chatbot/v1/chat"
  site-url="https://jwz-fd.nl/"
></ewfwp-chatbot-app>
```

Dit voorbeeld veronderstelt WordPress-permalinks en dezelfde website-origin. De plugin gebruikt zelf `rest_url()` en ondersteunt daardoor ook WordPress in een submap en eenvoudige permalinks (`?rest_route=...`). Voor cross-origin publicatie is aanvullende, expliciete serverconfiguratie nodig; de standaard laat alleen de eigen website toe. `heading`, `site-url`, `primary-color` en `accent-color` blijven instelbare attributen.

## Wat wordt wanneer geladen?

- Elke gewone pagina: alleen `assets/launcher.js` en `assets/launcher.css`, samen ongeveer **8 kB onbewerkt / 2,7 kB gzip**, plus een klein configuratie- en HTML-fragment.
- Bij eerste opening, of op een pagina met de ingebedde chatbot: ongeveer **circa 202 kB onbewerkt / 64 kB gzip** voor de volledige app. Geen AI-runtime, worker of modelbestanden.
- Elke vraag: één POST naar het WordPress-endpoint met de vraag en maximaal zes recente gespreksberichten. WordPress doet één aanvraag naar Ollama en geeft JSON terug.

De oude meegestuurde bundel was ongeveer 6 MB. De precieze HTTP-overdracht hangt af van compressie en caching op de webserver. Gzip-schattingen hierboven zijn lokaal gemeten, geen meting op uw productiehosting. Statische bestanden hebben een versie-URL voor browsercaching. De chat-API antwoordt met `Cache-Control: no-store, private`.

Bootstrap en de bijbehorende CSS-opruimstap zijn verwijderd: de chat gebruikte eigen stijlen. De app gebruikt Shadow DOM zodat de WordPress-theme en de chat elkaar minder beïnvloeden. De modal gebruikt de native `dialog`-functionaliteit: toetsenbordfocus blijft binnen het venster, Escape sluit en de focus gaat terug naar het knopje.

## REST-contract

```http
POST /wp-json/ewfwp-chatbot/v1/chat
Content-Type: application/json
```

```json
{
  "question": "Wat is een annuïteitenhypotheek?",
  "history": [
    { "role": "user", "content": "Ik koop mijn eerste woning." },
    { "role": "assistant", "content": "Waar wilt u meer over weten?" }
  ]
}
```

Voorbeeld van de vorm van een succesvol antwoord (de tekst wordt door het model gemaakt):

```json
{
  "text": "Een annuïteitenhypotheek ...",
  "action": { "label": "Bekijk hypotheekadvies", "path": "/hypotheekadvies/" }
}
```

`action` is optioneel. Alleen de server kiest een link uit de vaste routetabel; het model kiest een route-ID. De frontend toont antwoordtekst als tekst, niet als HTML. Dit is AI-generatie, geen rekenengine voor een gegarandeerde maximale hypotheek: daarvoor verwijst de assistent naar de bestaande calculator.

Fouten: 400 ongeldige invoer; 403 niet-toegestane browser-origin; 413 te grote body; 415 verkeerd contenttype; 429 te druk/limiet bereikt; 502 onbruikbaar modelantwoord; 503 AI-server niet beschikbaar. De frontend toont een passende melding en een knop om opnieuw te proberen. Bij falen wordt geen verzonnen AI-antwoord toegevoegd.

De publieke route is bewust toegankelijk voor uitgelogde bezoekers. Een WordPress-nonce wordt daar niet als authenticatie gebruikt; zo breken verlopen nonces in gecachete pagina’s het gesprek niet. De aparte verbindingstest `/ewfwp-chatbot/v1/test` vereist wél `manage_options` en de normale WordPress REST-nonce vanuit wp-admin.

## Grenzen en gegevens

- Vraag maximaal 300 tekens, historie maximaal zes berichten van ieder 1.200 tekens, requestbody maximaal 16 kB. Gebruikers mogen geen system-berichten aanleveren.
- Basislimieten: 10 aanvragen per IP per minuut, 60 sitebreed per minuut en twee gelijktijdige modelaanvragen. De tijdelijke tellers gebruiken gehashte IP-adressen. De minuutlimieten zijn best effort met WordPress-transients; dit is geen volledige bot- of DDoS-beveiliging. Gebruik bij veel verkeer ook de limieten van uw host/proxy. Achter een proxy wordt standaard `REMOTE_ADDR` gebruikt; bezoekers kunnen dan een limiet delen.
- Ollama krijgt maximaal 30 seconden per aanvraag; de browser wacht maximaal 45 seconden. Een afgebroken browseraanvraag stopt niet noodzakelijk een al gestarte berekening op de server. Langzame hosting kan eerder afbreken.
- De plugin slaat vragen en antwoorden niet op in de WordPress-database of browseropslag. Gesprekken leven in het geheugen van de pagina. Ze worden wel via WordPress naar uw AI-server verstuurd. Controleer afzonderlijk de logging van uw host/proxy/AI-server.
- Alleen beheerders met `manage_options` kunnen instellingen opslaan. WordPress controleert daarbij de formuliernonce. SVG’s gaan door een beperkte allowlist; SVG-upload wordt niet globaal voor WordPress aangezet.
- Website-informatie is handmatig aanvulbaar in wp-admin. De plugin crawlt de website niet en heeft geen automatisch actuele kennis. De serverprompt geeft instructies voor algemene informatie en verwijzing naar een adviseur. Dat garandeert geen foutloze modelantwoorden.

## Bestanden en bouwen

Belangrijkste aanpassingen:

- `ewfwp-chatbot-app/wp-wrapper.php`: pluginbootstrap en bestaande Elementor-registratie.
- `ewfwp-chatbot-app/includes/settings*.php`: beheerpagina en validatie.
- `ewfwp-chatbot-app/includes/frontend.php`: loader, chatbolletje, modal en shortcode.
- `ewfwp-chatbot-app/includes/rest-api.php`: publieke route, admin-test, invoercontrole en limieten.
- `ewfwp-chatbot-app/includes/provider.php`: systeemprompt, Ollama-aanvraag, antwoordvalidatie en bekende paginaroutes.
- `ewfwp-chatbot-app/assets/`: kleine loader/CSS en admin-SVG/testfunctionaliteit.
- `app/chatbot.service.ts`: HTTP-transport, foutafhandeling en annuleren; geen model meer in Angular.
- `scripts/`: bouw van distributiebestanden en een installatie-ZIP met de correcte pluginmap.

Gebruik Node 24 en npm 11, zoals in het oorspronkelijke project:

```sh
npm ci
npm test
npm run lint
npm run build:wordpress-plugin
```

De laatste opdracht maakt `ewfwp-chatbot-app.zip` aan. De map `ewfwp-chatbot-app/web-component` bevat daarna de productie-app en derdepartijlicenties. Source maps, caches en `node_modules` zijn niet nodig in WordPress.

Voor lokaal Angular-ontwikkelen naast een WordPress-testsite op `http://localhost:8080`:

```sh
npm start -- --proxy-config proxy.conf.example.json
```

Pas zowel `target` als de `Origin`-header in het voorbeeld aan uw lokale WordPress-adres aan. De header is uitsluitend voor de lokale ontwikkelproxy; de productiecode heeft geen externe CORS-uitzondering nodig.

## Validatie

Zie `VALIDATIE.md` voor uitgevoerde controles en bekende grenzen. De Angular-tests zijn onderdeel van `npm test`. `tests/wordpress/assertions.php` is bedoeld voor een wegwerp-WordPress in WordPress Playground en mockt uitsluitend de externe AI-aanvraag. Dit testbestand wordt niet in de plugin-ZIP opgenomen.
