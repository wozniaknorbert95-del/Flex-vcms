// Using built-in global fetch (Node 18+)

const callGemini = async (messages, context, apiKey) => {
    const systemPrompt = `🎯 ROLA\nJesteś moim osobistym mentorem, trenerem i „aniołem stróżem” w vibe-codingu.\n\nTwoje zadanie:\n- prowadzić mnie krok po kroku\n- motywować mnie\n- pilnować mojej konsekwencji\n- sprawdzać wykonanie zadań\n- NIE pozwalać mi się wycofać ani rozproszyć\n\nJesteś:\n- spokojny, konkretny, męski w komunikacji\n- wspierający, ale wymagający\n- skupiony na działaniu, nie teorii\n\n🧬 DOPASOWANIE DO MNIE (KLUCZOWE)\nDziałam jak Generator (Human Design):\n- najlepiej działam, gdy reaguję, nie gdy jestem zmuszany\n- mam dużo energii, ale tylko do rzeczy, które mnie angażują\n- blokuję się przy presji i nadmiarze\n\nTwoje zasady pracy ze mną:\n- dawaj mi małe, konkretne kroki\n- zadawaj pytania zamiast narzucać\n- pomagaj mi poczuć „czy to mnie kręci”\n- jeśli tracę energię → pomóż mi zmienić podejście, nie zmuszaj\n\n🧭 CEL GŁÓWNY\nPomóż mi:\n- nauczyć się vibe-codingu w praktyce\n- budować realne projekty\n- wejść w stan flow i regularnej pracy\n- stać się samodzielnym twórcą / programistą\n\n🔥 MOTYWACJA I TRYB STRAŻNIKA\n- Jeśli unikam działania, zatrzymaj mnie: "Unikasz. Wracamy do zadania."\n- Zawsze dawaj najmniejszy krok.\n- Nie dawaj długich wykładów, najwyżej 3 mocne zdania.`;

    const enrichedSystemPrompt = systemPrompt + "\n\n===== KONTEKST =====\n" + JSON.stringify(context, null, 2);

    const geminiPayload = {
        system_instruction: { parts: [{ text: enrichedSystemPrompt }] },
        contents: messages
    };

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const maxRetries = 2;
    let attempt = 0;

    while (attempt <= maxRetries) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(geminiPayload),
                signal: controller.signal
            });

            if (response.status === 429 || response.status >= 500) {
                if (attempt < maxRetries) {
                    attempt++;
                    console.warn(`[Gemini Retry] Attempt ${attempt} after status ${response.status}`);
                    await new Promise(r => setTimeout(r, 1000 * attempt));
                    continue;
                }
            }

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errData = await response.text();
                return { status: response.status, error: errData, ok: false };
            }

            const data = await response.json();
            return { status: response.status, data: data, ok: true };
        } catch (e) {
            if (e.name === 'AbortError') throw e;
            if (attempt < maxRetries) {
                attempt++;
                await new Promise(r => setTimeout(r, 1000 * attempt));
                continue;
            }
            clearTimeout(timeoutId);
            throw e;
        }
    }
};

module.exports = { callGemini };
