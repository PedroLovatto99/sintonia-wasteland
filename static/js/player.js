document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. PEGAR TODOS OS ELEMENTOS ---
    const audio = document.getElementById('radio-player');
    const overlay = document.getElementById('start-overlay');
    const volumeSlider = document.getElementById('volume-slider');
    
    // Elementos de texto para atualizar (Título e Artista)
    const titleEl = document.querySelector('.song-title');
    const artistEl = document.querySelector('.artist-name');

    // --- 2. CONFIGURAÇÃO DO VOLUME ---
    // Define o volume inicial (0.5 = 50%)
    audio.volume = 0.5;

    if (volumeSlider) {
        // Configura o slider visualmente para bater com o volume inicial
        volumeSlider.value = 0.5;
        volumeSlider.min = "0";
        volumeSlider.max = "1";
        volumeSlider.step = "0.01";

        // Adiciona o evento de troca de volume
        volumeSlider.addEventListener('input', function() {
            audio.volume = this.value;
            // console.log("Volume alterado para: " + this.value); // Debug opcional
        });
    }

    // --- 3. TELA DE INÍCIO (START / SPLASH SCREEN) ---
    // Isso destrava o áudio do navegador
    if (overlay) {
        overlay.addEventListener('click', function() {
            audio.play().then(() => {
                // Se der play com sucesso, esconde a tela de "Stand By"
                overlay.style.opacity = '0';
                setTimeout(() => { overlay.style.display = 'none'; }, 500);
            }).catch(error => {
                console.error("Erro ao tentar iniciar o áudio: ", error);
            });
        });
    }

    // --- 4. LOOP INFINITO (BUSCAR PRÓXIMA MÚSICA) ---
    // Quando a música acabar, busca a próxima no Python
    audio.addEventListener('ended', function() {
        console.log("Música acabou. Buscando a próxima...");
        
        fetch('/api/proxima-faixa')
            .then(response => response.json())
            .then(data => {
                
                // Atualiza os textos na tela
                if (titleEl) titleEl.textContent = data.titulo;
                if (artistEl) artistEl.textContent = data.artista || ""; // Se for DJ, fica vazio
                
                // Troca a fonte do áudio
                audio.src = data.url;
                
                // Toca automaticamente (agora o navegador permite)
                audio.play();
            })
            .catch(err => console.error("Erro na API ao buscar próxima música:", err));
    });

});