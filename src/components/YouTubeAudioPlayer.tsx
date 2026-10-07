import React, { useEffect, useRef } from 'react';

interface YouTubeAudioPlayerProps {
  videoId: string;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onPlaybackError?: () => void;
  onTrackEnd?: () => void;
}

/**
 * YouTube Audio Stream Engine
 * Uses a sandboxed declarative iframe without external script tags,
 * isolating third-party scripts from the host application window to prevent
 * unhandled cross-origin errors, and controls playback via postMessage.
 */
export const YouTubeAudioPlayer: React.FC<YouTubeAudioPlayerProps> = ({
  videoId,
  isPlaying,
  volume,
  isMuted,
  onPlaybackError,
  onTrackEnd,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Send command to YouTube iframe via postMessage
  const sendCommand = (func: string, args: (string | number | boolean)[] = []) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args,
          }),
          '*'
        );
      }
    } catch {
      // Ignored
    }
  };

  // Play / Pause control
  useEffect(() => {
    if (isPlaying) {
      sendCommand('playVideo');
    } else {
      sendCommand('pauseVideo');
    }
  }, [isPlaying]);

  // Volume & Mute control
  useEffect(() => {
    sendCommand('setVolume', [Math.round(volume * 100)]);
    if (isMuted || volume === 0) {
      sendCommand('mute');
    } else {
      sendCommand('unMute');
    }
  }, [volume, isMuted]);

  // Listen for iframe state messages (ended, error)
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data !== 'string') return;
        const data = JSON.parse(event.data);
        if (data.event === 'infoDelivery' && data.info) {
          // playerState: 0 = ended
          if (data.info.playerState === 0 && onTrackEnd) {
            onTrackEnd();
          }
        }
        if (data.event === 'onError' && onPlaybackError) {
          onPlaybackError();
        }
      } catch {
        // Not a JSON message or unrelated message, ignore
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => {
      window.removeEventListener('message', handleWindowMessage);
    };
  }, [onPlaybackError, onTrackEnd]);

  if (!videoId) return null;

  const srcUrl = `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=${
    isPlaying ? 1 : 0
  }&controls=0&disablekb=1&fs=0&playsinline=1&rel=0`;

  return (
    <div
      className="fixed -left-[9999px] -top-[9999px] w-2 h-2 opacity-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
      tabIndex={-1}
    >
      <iframe
        ref={iframeRef}
        key={videoId}
        src={srcUrl}
        title="Akashvani Calcutta Broadcast Feed"
        allow="autoplay; encrypted-media"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        className="w-1 h-1 pointer-events-none"
        tabIndex={-1}
        onError={() => {
          onPlaybackError?.();
        }}
      />
    </div>
  );
};
