document.addEventListener('DOMContentLoaded', function() {
    
    const audio = document.getElementById('radio-player');
    const titleEl = document.getElementById('titulo-visual'); 
    const artistEl = document.getElementById('artista-visual');
    const overlay = document.getElementById('start-overlay');
    const volumeSlider = document.getElementById('volume-slider');
    
    // Container pai para aplicar o estilo de texto longo
    const radioInfoContainer = document.querySelector('.radio-info');

    // --- CONFIG INICIAL ---
    audio.volume = 0.5;
    if (volumeSlider) {
        volumeSlider.value = 0.5;
        volumeSlider.addEventListener('input', function() { audio.volume = this.value; });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            audio.play().then(() => {
                overlay.style.opacity = '0';
                setTimeout(() => { overlay.style.display = 'none'; }, 500);
            }).catch(e => console.error(e));
        });
    }

    // --- FUNÇÕES VISUAIS ---

    const innerContainer = document.querySelector('.inner-container');

    function atualizarDisplay(titulo, subtitulo, isDJ = false) {
        if (!titleEl || !artistEl) return;

        titleEl.textContent = titulo;
        artistEl.textContent = subtitulo;

        if (isDJ) {
            // MUDANÇA 2: Ativamos o modo DJ no container PAI
            innerContainer.classList.add('dj-active');
            titleEl.classList.remove('blink-text'); 
        } else {
            // Desativamos (voltam as barras e volume)
            innerContainer.classList.remove('dj-active');
        }
    }

    function mostrarStatus(mensagem) {
        if (!titleEl || !artistEl) return;
        titleEl.textContent = "SYSTEM STATUS";
        titleEl.classList.add('blink-text'); // Título pisca
        artistEl.textContent = mensagem;
        radioInfoContainer.classList.remove('dj-mode');
    }

    // --- LÓGICA DO PLAYER ---

    function tocarProximaMusica() {
        console.log(">>> Iniciando música...");
        
        // Remove qualquer classe de DJ ou piscar
        titleEl.classList.remove('blink-text');
        radioInfoContainer.classList.remove('dj-mode');

        fetch('/proxima-musica')
            .then(res => res.json())
            .then(data => {
                atualizarDisplay(data.nome_musica, data.artista, false);
                audio.src = data.url;
                audio.play();
            })
            .catch(err => console.error("Erro música:", err));
    }

    function falarDJ(texto) {
        console.log("DJ Falando...");

        // 1. Mostra o texto do DJ na tela (Modo DJ Ativado)
        atualizarDisplay("THREE DOG - AO VIVO", texto, true);

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(texto);
        
        // Tenta forçar voz em português ou inglês
        // Dica: Se quiser listar as vozes, use synth.getVoices() no console
        utterance.lang = 'pt-BR'; 
        utterance.rate = 1.1; 
        utterance.pitch = 0.9;

        // --- O GRANDE FINAL ---
        utterance.onend = function() {
            console.log("DJ terminou.");
            
            // 2. Aviso que vai voltar a música
            mostrarStatus("REINICIANDO PLAYLIST...");

            // 3. Espera 2 segundos para o usuário ler o aviso, depois toca
            setTimeout(() => {
                tocarProximaMusica();
            }, 2000); 
        };

        synth.speak(utterance);
    }

    // --- QUANDO A MÚSICA ACABA ---
    audio.addEventListener('ended', function() {
        console.log("Música acabou.");

        // 1. Aviso visual imediato
        mostrarStatus("RECEBENDO TRANSMISSÃO...");

        // Pede o texto ao Python
        fetch('/chamar-dj')
            .then(res => res.text())
            .then(textoDoDJ => {
                // Pequeno delay dramático de 1.5s antes de começar a falar
                setTimeout(() => {
                    falarDJ(textoDoDJ);
                }, 1500);
            })
            .catch(err => {
                console.error("Erro DJ:", err);
                tocarProximaMusica(); // Se der erro, pula pra música
            });
    });

});