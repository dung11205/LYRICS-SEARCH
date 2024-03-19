
    const form = document.getElementById('form');
    const search = document.getElementById('search');
    const result = document.getElementById('result');
    const more = document.getElementById('more');

    const apiURL = 'https://api.lyrics.ovh';

    async function searchSong(term) {
        const res = await fetch(`${apiURL}/suggest/${term}`);
        const data = await res.json();
        showData(data);
    }

    async function getMoreSongs(url) {
        const res = await fetch(url);
        const data = await res.json();
        showData(data);
    }

    function showData(data) {
        result.innerHTML = `
            <ul class="songs"> 
                ${data.data
                    .map(
                        song => `<li>
                            <span><strong>${song.artist.name}</strong> - ${song.title}</span>
                            <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
                        </li>`
                    )
                    .join('')}
            </ul>
        `;

        if (data.prev || data.next) {
            more.innerHTML = `
                ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')"> Prev</button>` : ''}
                ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')"> Next</button>` : ''}
            `;
        } else {
            more.innerHTML = '';
        }
    }

    //hiển thị nút next và prev 
    async function getMoreSongs(url) {
        const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
        const data = await res.json(); // đợi để phân tích cú pháp JSON của phản hồi
        showData(data);
    }
    //get lyrics for song
    async function getLyrics(artist, songTitle){
        const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
        const data = await res.json();
    
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

        result.innerHTML = `<h2> <strong>${artist}</strong> - ${songTitle}</h2>
        <span>${lyrics}</span>
        `;

        more.innerHTML = '';
    }
    
    //event listeners
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const searchTerm = search.value.trim();
        if (!searchTerm) {
            alert('Hãy nhập dử liệu cần tìm kiếm');
        } else {
            await searchSong(searchTerm);
        }
    });


    //get lyrics button click (nhấp vào nút lời bài hát)
    result.addEventListener('click', e => {
        const clickedEl = e.target;

        if (clickedEl.tagName === 'BUTTON'){
            const artist = clickedEl.getAttribute('data-artist');
            const songTitle = clickedEl.getAttribute('data-songtible'); 
         
            getLyrics(artist, songTitle);
        }
    });
