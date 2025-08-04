import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';
import { createServer } from 'http';

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ YouTube to MP3/MP4 API is Running!");
});

app.get("/mp3", async (req, res) => {
  const videoURL = req.query.url;
  if (!ytdl.validateURL(videoURL)) return res.status(400).send("Invalid URL");

  const info = await ytdl.getInfo(videoURL);
  const title = info.videoDetails.title;

  res.header("Content-Disposition", `attachment; filename="${title}.mp3"`);

  ytdl(videoURL, {
    format: "mp3",
    filter: "audioonly",
    quality: "highestaudio"
  }).pipe(res);
});

app.get("/mp4", async (req, res) => {
  const videoURL = req.query.url;
  if (!ytdl.validateURL(videoURL)) return res.status(400).send("Invalid URL");

  const info = await ytdl.getInfo(videoURL);
  const title = info.videoDetails.title;

  res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);

  ytdl(videoURL, {
    format: "mp4",
    filter: "videoandaudio",
    quality: "highest"
  }).pipe(res);
});

export default function handler(req, res) {
  app(req, res);
}
