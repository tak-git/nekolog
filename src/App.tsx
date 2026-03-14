import { useState, useEffect } from 'react';
import { Camera, Mic, Wifi, Settings, Aperture, Bone } from 'lucide-react';
import { motion } from 'framer-motion';
import './App.css';

const feeds = [
  {
    id: 'cam-mother',
    name: 'カメラ1: お母さん',
    image: '/mother_calico_japanese_home_1773471714843.png',
    kbps: '156 KB/s',
    codec: 'H.264'
  },
  {
    id: 'cam-kitten-1',
    name: 'カメラ2: 子猫(毛づくろい)',
    image: '/kitten1_calico_grooming_1773471729272.png',
    kbps: '112 KB/s',
    codec: 'H.264'
  },
  {
    id: 'cam-kitten-2',
    name: 'カメラ3: 子猫(のび～)',
    image: '/kitten2_calico_stretching_1773471742096.png',
    kbps: '95 KB/s',
    codec: 'H.264'
  },
  {
    id: 'cam-kitten-3',
    name: 'カメラ4: 子猫(ごはん)',
    image: '/kitten3_calico_eating_1773471754132.png',
    kbps: '128 KB/s',
    codec: 'H.264'
  },
  {
    id: 'cam-hallway',
    name: 'カメラ5: 廊下',
    image: '/cat_walking_away_1773465511599.png',
    kbps: '98 KB/s',
    codec: 'H.264'
  },
  {
    id: 'cam-dog',
    name: 'カメラ6: 玄関',
    image: '/dog_sniffing_floor_1773465523105.png',
    kbps: '38 KB/s',
    codec: 'MJPEG'
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
    const triggerRandomEvent = () => {
      if (isLive) {
        const randomMsg = events[Math.floor(Math.random() * events.length)];
        showToast(randomMsg);
      }
      setTimeout(triggerRandomEvent, 15000 + Math.random() * 20000);
    };
    const initialTimeout = setTimeout(triggerRandomEvent, 10000);
    return () => clearTimeout(initialTimeout);
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

  // Smoother camera drift with easeInOut for more natural movement
  const getCameraDrift = () => {
    const drifts = [
      { // CAM1: お母さん
        scale: [1.02, 1.05, 1.02, 1.07, 1.02],
        x: [0, -3, 2, -2, 0],
        y: [0, -2, -4, -1, 0],
        transition: { duration: 25, repeat: Infinity, ease: "easeInOut" as any }
      },
      { // CAM2: 子猫(毛づくろい)
        scale: [1.05, 1.08, 1.05],
        x: [-2, 2, -2],
        y: [-1, 1, -1],
        transition: { duration: 15, repeat: Infinity, ease: "easeInOut" as any }
      },
      { // CAM3: 子猫(のび～)
        scale: [1.03, 1.06, 1.03],
        x: [0, 0],
        y: [-5, 5, -5],
        transition: { duration: 20, repeat: Infinity, ease: "easeInOut" as any }
      },
      { // CAM4: 子猫(ごはん)
        scale: [1.08, 1.12, 1.08],
        x: [-3, 3, -3],
        y: [-3, 3, -3],
        transition: { duration: 18, repeat: Infinity, ease: "easeInOut" as any }
      },
      { // CAM5: 廊下
        scale: [1.03, 1.05, 1.03],
        x: [-5, 5, -5],
        y: [0, 0],
        transition: { duration: 30, repeat: Infinity, ease: "easeInOut" as any }
      },
      { // CAM6: 玄関
        scale: [1.04, 1.06, 1.04],
        x: [0, 0],
        y: [-3, 3, -3],
        transition: { duration: 28, repeat: Infinity, ease: "easeInOut" as any }
      }
    ];
    return drifts[currentFeedIndex] || drifts[0];
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
            <motion.img 
              key={currentFeed.id}
              src={currentFeed.image} 
              alt={currentFeed.name} 
              className="video-feed-pixelated"
              animate={isLive ? getCameraDrift() : {}}
            />
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
