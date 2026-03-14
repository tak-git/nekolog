import { useState, useEffect } from 'react';
import { Camera, Mic, Wifi, Settings, Aperture, Bone } from 'lucide-react';
import './App.css';

const feeds = [
  {
    id: 'cam-living',
    name: 'リビング',
    media: '/kitten1.mp4',
    type: 'video',
    kbps: '112 KB/s',
    codec: 'H.264',
    driftClass: 'drift-1'
  }
];

function App() {
  const [currentFeedIndex, setCurrentFeedIndex] = useState(0);
  const [time, setTime] = useState(new Date());
  const [flash, setFlash] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLive, setIsLive] = useState(true);

  const currentFeed = feeds[currentFeedIndex];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Random Event System to enhance "Live" feel
  useEffect(() => {
    const events = ["動体検知アラート!", "マイク: 物音を検知", "AI: 猫の活動を確認"];
    let timeout: ReturnType<typeof setTimeout>;
    const triggerRandomEvent = () => {
      if (isLive) {
        const randomMsg = events[Math.floor(Math.random() * events.length)];
        showToast(randomMsg);
      }
      timeout = setTimeout(triggerRandomEvent, 15000 + Math.random() * 20000);
    };
    timeout = setTimeout(triggerRandomEvent, 10000);
    return () => clearTimeout(timeout);
  }, [isLive]);

  const switchCam = () => {
    setCurrentFeedIndex((prev) => (prev + 1) % feeds.length);
  };

  const takeSnapshot = () => {
    setFlash(true);
    showToast('写真を保存しました');
    setTimeout(() => setFlash(false), 200);
  };

  const feedTreat = () => {
    showToast('おやつをあげています...');
  };

  const talkToCat = () => {
    showToast('マイクON: 送信中...');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\//g, '-');
  };

  return (
    <div className="app-container">
      <header className="app-header-utilitarian">
        <div className="header-left">
          <span>ネコログ・管理パネル</span>
        </div>
        <div className="header-right">
          <Wifi size={14} />
          <span>{currentFeed.kbps}</span>
          <Settings size={14} className="header-icon" />
        </div>
      </header>

      <main className="camera-section">
        <div className="video-container" onClick={() => setIsLive(!isLive)}>
          <div className="video-wrapper">
            {currentFeed.type === 'video' ? (
              <video
                key={currentFeed.id}
                src={currentFeed.media}
                className={`video-feed-pixelated ${isLive ? currentFeed.driftClass : ''}`}
                autoPlay={isLive}
                loop
                muted
                playsInline
              />
            ) : (
              <img
                key={currentFeed.id}
                src={currentFeed.media}
                alt={currentFeed.name}
                className={`video-feed-pixelated ${isLive ? currentFeed.driftClass : ''}`}
              />
            )}
          </div>

          {/* Utilitarian OSD */}
          <div className="osd-digital top-left">
            <span>{currentFeed.name}</span>
          </div>

          <div className="osd-digital top-right text-right">
            <span className="timestamp-digital">{formatDate(time)}</span>
            <div>チャンネル-0{(currentFeedIndex + 1)}</div>
          </div>

          <div className="osd-digital bottom-left flex-row">
            <span className={isLive ? "text-red blinking-fast" : "text-muted"}>● {isLive ? "再生中" : "一時停止"}</span>
          </div>

          <div className="osd-digital bottom-right text-right">
            <span>{currentFeed.codec}</span><br/>
            <span>1920x1080</span>
          </div>

          {flash && <div className="flash-overlay-instant"></div>}
        </div>
      </main>

      <section className="controls-section-utilitarian">
        <div className="control-btn-flat" onClick={switchCam}>
          <Aperture size={22} />
          <span>切替</span>
        </div>
        <div className="control-btn-flat" onClick={takeSnapshot}>
          <Camera size={22} />
          <span>撮影</span>
        </div>
        <div className="control-btn-flat" onClick={talkToCat}>
          <Mic size={22} />
          <span>通話</span>
        </div>
        <div className="control-btn-flat text-blue" onClick={feedTreat}>
          <Bone size={22} />
          <span>おやつ</span>
        </div>
      </section>

      {toastMessage && (
        <div className="sys-toast">
          &gt; {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
