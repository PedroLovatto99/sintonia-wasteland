document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. SELEÇÃO DE ELEMENTOS ---
    const audio = document.getElementById('radio-player');
    
    // Controle de Volume
    const volumeSlider = document.getElementById('volume-slider');
    
    // Elementos de Texto (Visual do Pip-Boy)
    // Atenção: Use os IDs que definimos no HTML
    const titleEl = document.getElementById('titulo-visual'); 
    const artistEl = document.getElementById('artista-visual');
    
    // Tela de Início (Clique para liberar áudio)
    const overlay = document.getElementById('start-overlay');


    // --- 2. CONFIGURAÇÃO INICIAL ---
    
    // Volume inicial (50%)
    audio.volume = 0.5;
    if (volumeSlider) {
        volumeSlider.value = 0.5;
        volumeSlider.addEventListener('input', function() {
            audio.volume = this.value;
        });
    }

    // --- 3. LÓGICA DO PLAY INICIAL (FLASK JÁ TROUXE A MÚSICA) ---
    // Como o Flask já preencheu o src="" e os textos {{ }},
    // a gente não precisa dar fetch() agora. Só precisamos dar Play.

    if (overlay) {
        overlay.addEventListener('click', function() {
            // O usuário clicou, então o navegador libera o áudio
            audio.play().then(() => {
                // Sucesso: Esconde a tela de início
                overlay.style.opacity = '0';
                setTimeout(() => { overlay.style.display = 'none'; }, 500);
            }).catch(error => {
                console.error("Erro ao tentar iniciar o áudio:", error);
            });
        });
    }

    // --- 4. O LOOP INFINITO (BUSCAR PRÓXIMA) ---
    // Isso só roda quando a música do Flask acabar.
    
    audio.addEventListener('ended', function() {
        console.log("Música acabou! Chamando a próxima via API...");
        
        // Chama a rota que retorna JSON (não a rota da home!)
        fetch('/proxima-musica') 
            .then(response => response.json())
            .then(data => {
                console.log("Tocando agora:", data.nome_musica);

                // 1. Atualiza o Texto na Tela
                if (titleEl) titleEl.textContent = data.nome_musica;
                if (artistEl) artistEl.textContent = data.artista;

                // 2. Coloca o novo áudio e toca
                audio.src = data.url;
                audio.play();
            })
            .catch(erro => console.error("Erro ao buscar próxima música:", erro));
    });

});