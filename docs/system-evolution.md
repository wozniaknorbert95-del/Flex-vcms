---
title: "Ewolucja Systemu"
---

# 🧬 System Evolution

Przewodnik o tym jak nie utracić eksperymentalnego zysku na produkcji.

## 1. Zasada Jednego Źródła (SSoT)
Wszystkie modyfikacje o znaczeniu rdzeniowym (`core`), czy to cenowe, biznesowe, czy workflow'y opierają się na jednym stabilnym pliku `.json` lub `brain`, jak opisano w strukturze JADZI/VCMS. Zmiana jednego źródłowego pliku ma wpływać kaskadowo na zachowanie wszystkich instancji na VPS.

## 2. Promowanie Eksperymentów (From LAB to CORE)
Gdy przeprowadzony eksperyment w module `/lab` wytrzyma test produkcyjny (Deploy), Dowódca zmienia tag dokumentu z `[EXPERIMENTAL]` na `[STABLE]`. Następnie skrypt przenosi go z lab'u do wbudowanego katalogu `/reference` lub wyciąga z niego prawa do `/core/global-rules.md`.
