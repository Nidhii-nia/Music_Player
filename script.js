const musicData = {
  Pop: [
    {
      id: "pop1",
      image: "images\pop1.png",
      song: "As It Was",
      author: "Harry Styles",
      link: "audio\harry.mp3"
    },
    {
      id: "pop2",
      image: "images\pop2.png",
      song: "Love Me Like You Do",
      author: "Ellie Goulding",
      link: "audio\ellie.mp3"
    }
  ],
  Desi: [
    {
      id: "desi1",
      image: "images\desi1.png",
      song: "Mera Naam Mary Hai",
      author: "Ajay-Atul,Chinmayi",
      link: "audio\brothers.mp3"
    },
    {
      id: "desi2",
      image: "images\desi2.png",
      song: "Sajaunga Lukar Bhi",
      author: "Neeti Mohan",
      link: "audio\neeti.mp3"
    }
  ],
  Romantic: [
    {
      id: "rom1",
      image: "images\rom1.png",
      song: "Perfect",
      author: "Ed Sheeran",
      link: "audio\ed.mp3"
    },
    {
      id: "rom2",
      image: "images\rom2.png",
      song: "Khubsoorat",
      author: "Neha Kakkar",
      link: "audio\neha.mp3"
    }
  ]
};


const songList = document.getElementById('songList');
const player = document.getElementById('player');
const genre = document.getElementById('songGenre');
const Songs = document.getElementById('Songs');
const songDisplay = document.getElementById('songDisplay');
const imgsong = document.getElementById('imgsong');
const currSong = document.getElementById('currSong');
const artist = document.getElementById('artist');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const currPlaylist = document.getElementById('currPlaylist');
const playlistcontent = document.getElementById('playlistcontent');
const allPlaylists = document.getElementById('allPlaylists');
const create = document.getElementById('create');

let currentSongs = [];
let currentIndex = 0;

let playlists = {};
let currentPlaylistName = null;

// Song loader
function loadSong(index) {
  const songObj = currentSongs[index];
  if (!songObj) return;
  imgsong.src = songObj.image;
  currSong.textContent = songObj.song;
  artist.textContent = songObj.author;
  player.src = songObj.link;
  currentIndex = index;
}

function allSongs() {
  songList.innerHTML = "";
  currentSongs = [];
  Object.values(musicData).forEach((genreArr) => {
    genreArr.forEach((songObj) => {
      currentSongs.push(songObj);
      const songPara = document.createElement('p');
      songPara.classList.add('para');
      songPara.textContent = songObj.song;
      songPara.addEventListener('click', () => {
        loadSong(currentSongs.indexOf(songObj));
      });
      songList.appendChild(songPara);
    });
  });
  if (currentSongs.length) loadSong(0);
}

function displayByGenre(genre) {
  songList.innerHTML = "";
  currentSongs = musicData[genre].slice();
  currentSongs.forEach((obj, idx) => {
    const songPara = document.createElement('p');
    songPara.classList.add('para');
    songPara.textContent = obj.song;
    songPara.addEventListener('click', () => {
      loadSong(idx);
    });
    songList.appendChild(songPara);
  });
  if (currentSongs.length) loadSong(0);
}

function prevBtn() {
  if (currentSongs.length === 0) return;
  let newIndex = currentIndex - 1;
  if (newIndex < 0) newIndex = currentSongs.length - 1;
  loadSong(newIndex);
}

function nextBtn() {
  if (currentSongs.length === 0) return;
  let newIndex = currentIndex + 1;
  if (newIndex >= currentSongs.length) newIndex = 0;
  loadSong(newIndex);
}

prev.addEventListener('click', prevBtn);
next.addEventListener('click', nextBtn);
Songs.addEventListener('click', allSongs);
genre.addEventListener('change', (e) => {
  displayByGenre(e.target.value);
});
allSongs();

// Create Playlist
create.addEventListener('click', () => {
  const name = prompt("Enter Playlist Name: ");
  if (name && !playlists[name]) {
    playlists[name] = [];
    renderAllPlaylists();
  }
});

// Render All Playlists
function renderAllPlaylists() {
  allPlaylists.innerHTML = "";
  Object.keys(playlists).forEach(name => {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.addEventListener('click', () => {
      renderPlaylistContent(name);
    });
    allPlaylists.appendChild(btn);
  });
}

// Add song to playlist
document.getElementById('addPlaylist').addEventListener('click', () => {
  const names = Object.keys(playlists);
  if (names.length === 0) return alert("No playlists. Create one first!");
  const choice = prompt("Add to which playlist? Available:\n" + names.join(", "));
  if (choice && playlists[choice]) {
    playlists[choice].push(currentSongs[currentIndex]);
    renderPlaylistContent(choice);
    renderAllPlaylists(); // Ensure updates visible if needed
  }
});

// Render Playlist Content
function renderPlaylistContent(name) {
  playlistcontent.innerHTML = "";
  currPlaylist.textContent = name;
  currentPlaylistName = name;
  playlists[name].forEach((songObj, idx) => {
    const songPara = document.createElement('p');
    songPara.textContent = songObj.song;
    songPara.addEventListener('click', () => {
      loadSongFromPlaylist(name, idx);
    });
    playlistcontent.appendChild(songPara);
  });
}

const combinedSearch = document.getElementById('combinedSearch');

combinedSearch.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();

  // Filter songs
  songList.innerHTML = "";
  currentSongs = [];
  Object.values(musicData).forEach(genreArr => {
    genreArr.forEach(songObj => {
      if (songObj.song.toLowerCase().includes(query)) {
        currentSongs.push(songObj);
        const songPara = document.createElement('p');
        songPara.textContent = songObj.song;
        songPara.addEventListener('click', () => {
          loadSong(currentSongs.indexOf(songObj));
        });
        songList.appendChild(songPara);
      }
    });
  });
  if (currentSongs.length) loadSong(0);

  // Filter playlists
  allPlaylists.innerHTML = "";
  Object.keys(playlists).forEach(name => {
    if (name.toLowerCase().includes(query)) {
      const btn = document.createElement('button');
      btn.textContent = name;
      btn.addEventListener('click', () => {
        renderPlaylistContent(name);
      });
      allPlaylists.appendChild(btn);
    }
  });
});


// Play song from playlist
function loadSongFromPlaylist(listName, idx) {
  const songObj = playlists[listName][idx];
  imgsong.src = songObj.image;
  currSong.textContent = songObj.song;
  artist.textContent = songObj.author;
  player.src = songObj.link;
}

const toggleBtn = document.getElementById('toggle');

let isDark = false;
function switchTheme() {
  if (isDark) {
    document.body.style.background = 'linear-gradient(120deg, #eeeefb 0%, #89f7fe 43%, #66a6ff 100%)'; // Light background
    toggleBtn.textContent = 'Dark';
    isDark = false;
  } else {
    document.body.style.background = '#121212';
    toggleBtn.textContent = 'Light';
    isDark = true;
  }
}
toggleBtn.textContent = 'Dark';

toggleBtn.addEventListener('click', switchTheme);

