const apiKey = 'YOUR_API_KEY'; // Replace with your API key
const channelId = 'YOUR_CHANNEL_ID'; // Replace with your channel ID
const maxResults = 12;

const videoList = document.getElementById('video-list');
const player = document.getElementById('player');

// Fetch the Uploads playlist ID
async function fetchUploadsPlaylistId() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].contentDetails.relatedPlaylists.uploads;
  } else {
    throw new Error('Channel not found');
  }
}

// Fetch videos
async function fetchVideos(playlistId) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.items || [];
}

// Render videos
function renderVideos(videos) {
  if (videos.length === 0) {
    videoList.innerHTML = '<p>No videos found.</p>';
    return;
  }

  videos.forEach(video => {
    const videoId = video.snippet.resourceId.videoId;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.medium.url;

    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';

    videoItem.innerHTML = `
      <img src="${thumbnail}" alt="${title}" class="video-thumb" />
      <div class="video-title">${title}</div>
    `;

    videoItem.onclick = () => {
      player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    videoList.appendChild(videoItem);
  });

  // Auto-load first video
  player.src = `https://www.youtube.com/embed/${videos[0].snippet.resourceId.videoId}`;
}

// Init
async function init() {
  try {
    const uploadsPlaylistId = await fetchUploadsPlaylistId();
    const videos = await fetchVideos(uploadsPlaylistId);
    renderVideos(videos);
  } catch (err) {
    videoList.innerHTML = `<p>Error loading videos: ${err.message}</p>`;
  }
}

init();
