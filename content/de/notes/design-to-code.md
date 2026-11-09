---
title: Design-to-Code-Pipeline
description: Wie ein versioniertes Token-Paket und Komponenten-Contracts verhindern, dass Design und Code auseinanderdriften, und wie Designer damit im Code prototypen können.
date: "2026-11"
# Hidden for now: not listed, not built, not in the sitemap. Set to false to publish.
draft: true
---

Hier geht es darum, wie Design bei OWT in den Code kommt, und was ich daran geändert habe. Keine Kundennamen und keine Kunden-Screens. Es geht um die Ideen.

Kurz gesagt: Ich habe eine Pipeline mit einem versionierten Token-Paket und Komponenten-Contracts eingeführt. Sie verhindert, dass Design und Code auseinanderdriften, und sie lässt Designer im Code prototypen.

::cs-section{n="01" title="Drift"}
Jedes Produktteam kennt das. Die Designdatei sagt das eine, die Produktion das andere, und niemand weiss, wann sie sich getrennt haben. Eine Farbe wird «nur vorübergehend» hart codiert. Eine Komponente bekommt ein Prop, von dem das Design nie gehört hat. Ein Abstand wird nach Augenmass gesetzt.

Nichts davon ist irgendjemandes Schuld. Es passiert, weil Design und Code zwei Quellen der Wahrheit haben, und der Handoff dazwischen ist ein Mensch, der einen Screen abliest. Die Lösung ist nicht ein besserer Handoff, sondern nur eine einzige Quelle.
::

::cs-section{n="02" title="Eine Quelle: ein versioniertes Token-Paket"}
Designentscheide leben als Design Tokens: Farben, Schrift, Abstände, Radien, Bewegung. Sie entstehen in Figma, werden als Daten exportiert und zu einem Paket kompiliert, das jede App wie jede andere Abhängigkeit installiert.

:::cs-diagram
---
label: Wie ein Designentscheid von Figma in jede App gelangt
caption: Tokens verlassen Figma als Daten, werden einmal kompiliert und als versioniertes Paket ausgeliefert. Eine Änderung ist ein Release mit Changelog, keine Nachricht im Chat.
steps:
  - title: Figma-Variablen
    detail: Designer ändern Entscheide dort, wo sie ohnehin arbeiten.
  - title: Token-Daten (JSON)
    detail: Primitives, dann semantische Tokens, die auf sie verweisen.
  - title: Build
    detail: Kompiliert zu CSS-Variablen und typisierten Konstanten.
  - title: Versioniertes Paket
    detail: Semantische Versionierung, ein Changelog, ein Review.
    accent: true
  - title: Apps
    detail: Jede installiert und aktualisiert es wie jede Abhängigkeit.
    items: [Produkt A, Produkt B, Prototyp]
---
:::

Zwei Ebenen zählen. **Primitives** sind die rohe Palette und die Skalen. **Semantische Tokens** sagen, wofür ein Wert da ist: Hintergrund, Text, Akzent, Linie. Komponenten dürfen nur semantische Tokens lesen. Genau diese eine Regel macht aus einem Rebranding, einem Dark Mode oder einem zweiten Produkt eine Änderung von Werten statt eines Neubaus.
::

::cs-section{n="03" title="Komponenten-Contracts"}
Tokens legen die Werte fest. Contracts legen die Komponenten fest. Ein Contract ist eine kurze, schriftliche Vereinbarung pro Komponente, der Design und Code beide zustimmen:

- **Anatomie und Props.** Woraus die Komponente besteht und jede Variante, die es gibt, mit denselben Begriffen in Figma und im Code.
- **Zustände.** Default, Hover, Fokus, deaktiviert, Laden, Fehler. Steht ein Zustand nicht im Contract, wird er nicht ausgeliefert.
- **Erlaubte Tokens.** Keine Rohwerte. Eine Lint-Regel setzt das durch.
- **Barrierefreiheit.** Rollen, Tastaturverhalten, Fokusreihenfolge, Kontrast.

:todo[one concrete example of a contract you wrote, anonymised: which component, and what the contract caught]

Der Contract ist absichtlich langweilig. Er verwandelt «Entspricht das dem Design?» von einer Meinungsfrage in eine Checkliste.
::

::cs-section{n="04" title="Designer prototypen im Code"}
Sobald Tokens und Komponenten geteilt sind, kann eine Designerin einen Prototyp aus den echten Komponenten bauen, statt sie neu zu zeichnen. Der Prototyp verhält sich dann wie das Produkt, weil er aus den Teilen des Produkts besteht. Fragen wie «Was passiert auf einem kleinen Screen?» oder «Wie lädt das?» werden durch Ausprobieren beantwortet, nicht durch Annotationen.

Hier hilft auch KI. Ich habe Claude Skills für das Designteam gebaut: gepackte Anleitungen, die unsere Tokens, unsere Contracts und unsere Konventionen kennen, sodass der Code, bei dem sie helfen, die Regeln schon einhält. Und ich habe praktische Claude × Figma Workshops für Kunden durchgeführt, bei denen Teams ihre eigenen Dateien mitbrachten und mit einem funktionierenden Setup nach Hause gingen.

:todo[one or two sentences on what a skill does in practice, and what clients took away from the workshops]
::

::cs-section{n="05" title="Diese Website ist eine kleine Demo"}
Diese Website ist dieselbe Idee in der Grösse eines Portfolios. Es gibt Primitives, ein semantisches Set, einen Build-Schritt, der jedes Farbpaar auf Kontrast prüft, und eine Lint-Regel, die anschlägt, wenn eine Komponente eine rohe Farbe verwendet oder etwas in Grossbuchstaben setzt.

:::cs-diagram
---
label: Wie die Tokens dieser Website funktionieren
caption: Dieselben drei Ebenen wie bei der Arbeit, nur ohne Paket.
steps:
  - title: primitives.json
    detail: Weiss, eine neutrale Skala, ein Orange.
  - title: semantic.json
    detail: bg, ink, ink-muted, line, panel, signal.
  - title: Style Dictionary
    detail: CSS-Variablen, plus ein WCAG-Kontrastcheck.
  - title: Komponenten
    detail: Lesen nur semantische Tokens. Lint setzt das durch.
    accent: true
---
:::

Drück irgendwo auf der Website die Delete-Taste, oder nutz den Setup-Link im Footer, um zu sehen, wie sie gebaut ist.
::

::cs-section{title="Mein Teil"}
- Die Pipeline vorgeschlagen und eingeführt: das Token-Paket und die Komponenten-Contracts. :todo[confirm what you built yourself vs. with developers]
- Claude Skills für das Designteam gebaut.
- Praktische Claude × Figma Workshops für Kunden durchgeführt.
::

::cs-section{title="Was ich anders machen würde"}
:todo[your words: what would you set up differently if you started the pipeline again tomorrow?]
::
