document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('radio-player');
    const overlay = document.getElementById('start-overlay');
    
    const titleEl = document.querySelector('.song-title');
    const artistEl = document.querySelector('.artist-name');

    // 1. O Clique Inicial (Apenas uma vez na vida)
    overlay.addEventListener('click', function() {
        audio.play().then(() => {
            overlay.style.opacity = '0';
            setTimeout(() => { overlay.style.display = 'none'; }, 500);
        }).catch(err => console.log("Erro no play inicial:", err));
    });

    // 2. O Segredo da Rádio Infinita
    // Quando a música acabar ('ended'), faz isso:
    audio.addEventListener('ended', function() {
        
        // Chama seu Backend Python pedindo a próxima atração
        fetch('/api/proxima-faixa') 
            .then(response => response.json())
            .then(data => {
                
                // --- ATUALIZA A TELA ---
                // Se for música, mostra artista. Se for DJ, esconde artista.
                titleEl.textContent = data.titulo;
                artistEl.textContent = data.artista || ""; // Deixa vazio se for DJ
                
                // --- TROCA O ÁUDIO ---
                audio.src = data.url;
                
                // --- TOCA SOZINHO (O navegador já deixa agora) ---
                audio.play();
                
            })
            .catch(err => console.error("Erro ao buscar próxima:", err));
    });
});