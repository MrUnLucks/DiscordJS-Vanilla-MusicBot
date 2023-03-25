const ytSearch = require("yt-search");
const songFinder = async (query) => {
  let songResult = await ytSearch(query);
  return songResult.videos.length > 1 ? songResult.videos[0] : null;
};
module.exports = songFinder;
