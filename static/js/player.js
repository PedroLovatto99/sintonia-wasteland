document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. SELEÇÃO DE ELEMENTOS ---
    const audio = document.getElementById('radio-player');
    const titleEl = document.getElementById('titulo-visual'); 
    const artistEl = document.getElementById('artista-visual');
    const overlay = document.getElementById('start-overlay');
    const volumeSlider = document.getElementById('volume-slider');
    
    // Containers
    const radioInfoContainer = document.querySelector('.radio-info');
    const innerContainer = document.querySelector('.inner-container');

    // --- VARIÁVEIS DE CACHE (PRELOAD) ---
    let proximoTextoDJ = null; // Aqui guardamos o texto enquanto a música toca
    let carregandoDJ = false;  // Para não pedir o texto 50 vezes ao mesmo tempo

    // --- 2. CONFIGURAÇÃO DE VOZ (ANTI-SOTAQUE) ---
    // Mesmo mantendo o original, é bom forçar a busca por voz BR
    let vozSelecionada = null;
    function carregarVozes() {
        const vozes = window.speechSynthesis.getVoices();
        vozSelecionada = vozes.find(v => v.name.includes('Google Português')) || 
                         vozes.find(v => v.name.includes('Microsoft Daniel')) ||
                         vozes.find(v => v.lang === 'pt-BR');
    }
    window.speechSynthesis.onvoiceschanged = carregarVozes;
    carregarVozes();

    // --- 3. CONFIGURAÇÃO DE ÁUDIO ---
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

    // --- 4. FUNÇÕES VISUAIS ---

    function atualizarDisplay(titulo, subtitulo, isDJ = false) {
        if (!titleEl || !artistEl) return;

        titleEl.textContent = titulo;
        artistEl.textContent = subtitulo;

        if (isDJ) {
            innerContainer.classList.add('dj-active');
            titleEl.classList.remove('blink-text'); 
        } else {
            innerContainer.classList.remove('dj-active');
        }
    }

    function mostrarStatus(mensagem) {
        if (!titleEl || !artistEl) return;
        titleEl.textContent = "SYSTEM STATUS";
        titleEl.classList.add('blink-text');
        artistEl.textContent = mensagem;
        if(radioInfoContainer) radioInfoContainer.classList.remove('dj-mode');
        innerContainer.classList.remove('dj-active'); // Garante que barras voltem no status
    }

    // --- 5. LÓGICA DO PLAYER ---

    function tocarProximaMusica() {
        console.log(">>> Iniciando música...");
        
        // Limpa cache antigo para garantir
        proximoTextoDJ = null;
        carregandoDJ = false;

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

        atualizarDisplay("THREE DOG - AO VIVO", texto, true);

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(texto);
        
        // Configurações de voz
        if (vozSelecionada) utterance.voice = vozSelecionada;
        utterance.lang = 'pt-BR'; 
        utterance.rate = 1.1; 
        utterance.pitch = 0.9;

        utterance.onend = function() {
            console.log("DJ terminou.");
            mostrarStatus("REINICIANDO PLAYLIST...");
            setTimeout(() => {
                tocarProximaMusica();
            }, 2000); 
        };

        // Tratamento de erro (se o navegador falhar em falar)
        utterance.onerror = function() {
            tocarProximaMusica();
        }

        synth.cancel(); // Para falas anteriores
        synth.speak(utterance);
    }

    // --- 6. O PRELOAD (A MÁGICA ACONTECE AQUI) ---
    
    // Monitora o tempo da música constantemente
    audio.addEventListener('timeupdate', function() {
        // Verifica se audio.duration é um número válido para evitar erros
        if (!audio.duration) return;

        const tempoRestante = audio.duration - audio.currentTime;

        // Se faltar menos de 20s E ainda não começamos a carregar E não temos o texto pronto
        if (tempoRestante < 30 && !carregandoDJ && !proximoTextoDJ) {
            console.log("⏳ Pré-carregando texto do DJ...");
            carregandoDJ = true;

            fetch('/chamar-dj')
                .then(res => res.text())
                .then(texto => {
                    console.log("✅ Texto do DJ pronto no cache!");
                    proximoTextoDJ = texto;
                    carregandoDJ = false; // Libera a flag (embora proximoTextoDJ já bloqueie)
                })
                .catch(err => {
                    console.error("Erro no preload:", err);
                    carregandoDJ = false; // Libera para tentar de novo se der erro
                });
        }
    });

    // --- 7. QUANDO A MÚSICA ACABA ---
    audio.addEventListener('ended', function() {
        console.log("Música acabou.");
        mostrarStatus("RECEBENDO TRANSMISSÃO...");

        // VERIFICA SE O PRELOAD FUNCIONOU
        if (proximoTextoDJ) {
            console.log("🚀 Usando texto do cache (Zero Delay)!");
            
            // Pequeno delay de 1s só para ler o "Recebendo Transmissão"
            setTimeout(() => {
                falarDJ(proximoTextoDJ);
                // Limpa o cache para não repetir a mesma fala depois
                proximoTextoDJ = null; 
            }, 1000);

        } else {
            console.log("⚠️ Cache vazio (Música curta?), buscando agora...");
            
            // Fallback: Se a música era muito curta e não deu tempo de carregar
            fetch('/chamar-dj')
                .then(res => res.text())
                .then(textoDoDJ => {
                    falarDJ(textoDoDJ);
                })
                .catch(err => {
                    tocarProximaMusica();
                });
        }
    });

});