# Schatzsuche JGA

Eine mobile, deutschsprachige GitHub-Pages-Website für eine Schatzsuche mit fünf geheimen Stationen. Jede Station besitzt einen zufälligen achtstelligen URL-Pfad. Die Startseite enthält bewusst keine Links auf die Stationen.

> **Wichtig:** Nicht erratbare URLs sind kein Zugriffsschutz. Eine veröffentlichte GitHub-Pages-Site ist normalerweise öffentlich erreichbar. Keine persönlichen, vertraulichen oder sicherheitsrelevanten Inhalte hinterlegen.

## Inhalte bearbeiten

Alle Rätsel, Hinweise, Aufgaben und URL-Pfade stehen zentral in [`src/stations.mjs`](src/stations.mjs). Nach einer Änderung lokal prüfen:

```sh
npm test
```

Der Build erzeugt die vollständige Website in `dist/`. Für eine lokale Vorschau:

```sh
python3 -m http.server 8000 -d dist
```

Danach `http://localhost:8000` im Browser öffnen.

## GitHub Pages für dieses private Repository einrichten

1. Die Dateien committen und auf den Branch `main` pushen.
2. Auf GitHub das Repository öffnen und **Settings → Pages** wählen.
3. Unter **Build and deployment** bei **Source** die Option **GitHub Actions** auswählen. Keinen Branch- oder `/docs`-Ordner als Quelle einstellen.
4. Unter **Actions** den Lauf **GitHub Pages** abwarten. Der Workflow testet und baut die Site und veröffentlicht ausschließlich `dist/`.
5. Nach erfolgreichem Lauf steht die Site unter `https://fidge123.github.io/schatzsuche-jga/` bereit. Die URL wird auch im Deployment-Schritt angezeigt.

Falls GitHub die Pages-Einstellung für das private Repository nicht anbietet, benötigt das persönliche Konto einen GitHub-Tarif, der Pages aus privaten Repositories unterstützt. Das private Repository macht die veröffentlichte Website nicht automatisch privat. Organisations-Repositories können zusätzlich durch Tarif- und Organisationsrichtlinien eingeschränkt sein.

Der Workflow besitzt nur die benötigten Rechte (`contents: read`, `pages: write`, `id-token: write`). Falls Actions organisationsweit deaktiviert oder eingeschränkt sind, muss ein Admin die verwendeten offiziellen GitHub-Actions freigeben.

## Stations-URLs und QR-Druckbogen

Nach dem ersten erfolgreichen Deployment die endgültigen URLs ausgeben:

```sh
npm run urls
```

Die letzte ausgegebene Adresse führt zum nicht verlinkten Druckbogen mit allen fünf QR-Codes. Im Browser **Druckbogen drucken** wählen; das Drucklayout ist für A4 optimiert.

Bei einer eigenen Domain die Basis-URL als Argument übergeben:

```sh
npm run urls -- https://schatz.example.de/
```

Der GitHub-Actions-Build übernimmt die dort konfigurierte Pages- oder Custom-Domain-URL automatisch in die QR-Codes. Die Codes werden beim Build als SVG-Dateien erzeugt und benötigen im Browser weder ein externes Werkzeug noch eine CDN-Verbindung. Jeden gedruckten Code vor dem Verteilen mit einem Mobiltelefon testen.

Werden die `route`-Werte später geändert, funktionieren bereits gedruckte QR-Codes nicht mehr. Deshalb die endgültigen Pfade festlegen, bevor die Codes gedruckt werden.
