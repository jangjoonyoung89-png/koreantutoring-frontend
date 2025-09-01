import React, { useEffect, useState } from "react";
import { getVideos } from "../api/api";
import VideoPlayer from "./VideoPlayer";

function VideoList() {
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getVideos().then(setVideos).catch(console.error);
  }, []);

  return (
    <div>
      <h2>수업 비디오</h2>
      <ul>
        {videos.map(v => (
          <li key={v._id} onClick={() => setSelected(v)}>
            {v.title}
          </li>
        ))}
      </ul>
      {selected && <VideoPlayer videoUrl={selected.filePath} />}
    </div>
  );
}

export default VideoList;