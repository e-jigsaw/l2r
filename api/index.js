const got = require('got')
const RSS = require('rss')

module.exports = async (req, res) => {
  const r = await got(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=neo6120&api_key=${process.env.LAST_FM_API_KEY}&format=json`)
  const tracks = JSON.parse(r.body).recenttracks.track
  const feed = new RSS({
    title: 'last.fm'
  })
  tracks.map(track => {
    if (track.date) {
      feed.item({
        title: `${track.name} | ${track.artist['#text']}`,
        url: track.url,
        guid: track.date.uts,
        date: new Date(track.date.uts * 1000)
      })
    }
  })
  res.setHeader('Content-Type', 'text/xml')
  res.status(200).send(feed.xml())
}
