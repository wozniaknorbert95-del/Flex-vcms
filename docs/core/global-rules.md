---
title: "Globalne Prawa VCMS"
---

# 🛡️ Global Rules (Systemowe Obostrzenia)

To są niezmienne obostrzenia pracy z projektami. Agent weryfikujący musi traktować te wpisy jako Hard-Rules przed jakimkolwiek commit'em kodu.

## 1. Technologia Wykonawcza (Zero Elementora)
ZABRANIA SIĘ kategorycznie instalowania, korzystania i polegania na Page Builderach takich jak Elementor. Architektura bazuje na customowym kodowaniu na fundamentach `flexgrafik-wizard-theme`, Node.js (Vite, VitePress) oraz rozwiązaniach szytych na miarę.

## 2. Architektura Ciemni (Dark Premium)
Wszystkie systemy zewnętrzne i wewnętrzne (szczególnie KODA, VCMS) operują w wizualnym standardzie *Dark Premium*:
- **Paleta**: Głębokie szarości (np. `#0A0A0A`, `#111111`) bez nadmiernych kontrastów dla tekstu (`#E5E7EB`). 
- **Złota proporcja UI/UX**: Zero nadmuchanych paddingów, ostre krawędzie, precyzyjna przestrzeń – tryb militarno/deweloperski i rygorystyczny design mobilny.

## 3. Izolacja Językowa
1. **Nederlands (NL)**: Interfejs używany przez ostatecznego klienta sklepu/platformy (UI, copywriting).
2. **Angielski (EN)**: Architektura dewelopera: nazwy zmiennych, komentarze w kodzie, branch'e na Git i commity.
3. **Polski (PL)**: Twój naturalny język wewnętrznego dowodzenia - asynchroniczny z KODA i logami z sesji na dysku. Nigdy go nie wypuszczaj w formie komentarza do publicznego GitHuba.
