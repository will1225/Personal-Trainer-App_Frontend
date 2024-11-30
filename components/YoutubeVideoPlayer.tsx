import React, { useState, useCallback } from "react";
import { View, Text } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const YouTubeVideoPlayer = ({ youtubeURL }: any) => {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: any) => {
    if (state === "ended") {
      setPlaying(false);
      alert("Video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  // Extract video ID from the YouTube URL
  const videoId = youtubeURL.split("v=")[1];

  return (
    <View>
      <YoutubePlayer height={300} play={playing} videoId={videoId} onChangeState={onStateChange} />
    </View>
  );
};

export default YouTubeVideoPlayer;
