import React from "react";

function VideoPlayer({ videoUrl }) {
  return (
    <video width="100%" height="400" controls>
      <source src={videoUrl} type="video/mp4" />
      브라우저가 비디오를 지원하지 않습니다.
    </video>
  );
}

export default VideoPlayer;