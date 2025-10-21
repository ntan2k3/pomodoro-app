import { AnimatePresence, motion } from "framer-motion";
import { Check, Pause, Play, RotateCcw, Settings } from "lucide-react";
import { useEffect, useState } from "react";

const App = () => {
  const [seconds, setSeconds] = useState(1500);
  const [showSetting, setShowSetting] = useState(false);
  const [timeFocus, setTimeFocus] = useState(25);
  const [timeBreak, setTimeBreak] = useState(5);
  const [mode, setMode] = useState("focus");
  const [isPlay, setIsPlay] = useState(false);
  const [sound, setSound] = useState("none");

  const formatTime = (time) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const applySetting = () => {
    setSeconds(() => (mode === "focus" ? timeFocus * 60 : timeBreak * 60));
    setShowSetting(false);
    setIsPlay(false);
  };

  useEffect(() => {
    if (!isPlay) return;
    if (seconds === 0) {
      if (sound !== "none") {
        const audio = new Audio("./assets/bell.mp3");
        audio.play();
      }

      const nextMode = mode === "focus" ? "break" : "focus";
      setMode(nextMode);
      setSeconds(nextMode === "focus" ? timeFocus * 60 : timeBreak * 60);
      setIsPlay(false);
      return;
    }

    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [isPlay, seconds, mode, timeFocus, timeBreak, sound]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen w-full bg-[#fffef9]"
    >
      <motion.div
        layout
        className="flex flex-col items-center justify-center space-y-6 border-4 border-dashed border-gray-400 w-[300px] md:w-[400px] p-10 rounded-2xl bg-[#fffef4] shadow-[4px_4px_0px_#00000033]"
      >
        <h1 className="text-2xl md:text-3xl font-bold underline decoration-wavy decoration-pink-400">
          {mode === "focus" ? "✏️ Focus Mode" : "☕ Break mode"}
        </h1>

        {/* Timer */}
        <motion.div
          key={seconds} // thay đổi mỗi giây -> trigger animation
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-5xl md:text-6xl font-mono bg-yellow-100 border-3 border-dashed border-gray-500 rounded-xl p-4 inline-block shadow-inner"
        >
          {formatTime(seconds)}
        </motion.div>

        {/* Action */}
        <div className="flex justify-center items-center gap-4">
          {[
            {
              icon: isPlay ? <Pause /> : <Play />,
              action: () => setIsPlay(!isPlay),
              color: "bg-pink-300 hover:bg-pink-400",
            },
            {
              icon: <RotateCcw />,
              action: () => {
                setSeconds(mode === "focus" ? timeFocus * 60 : timeBreak * 60);
                setIsPlay(false);
              },
              color: "bg-teal-300 hover:bg-teal-400",
            },
            {
              icon: <Settings />,
              action: () => setShowSetting(!showSetting),
              color: "bg-purple-300 hover:bg-purple-400",
            },
          ].map((btn, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={btn.action}
              className={`flex items-center justify-center border-2 border-black text-white ${btn.color} w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full cursor-pointer shadow-[3px_3px_1px_0_gray]`}
            >
              {btn.icon}
            </motion.button>
          ))}
        </div>

        {/* Setting panel */}
        <AnimatePresence mode="wait">
          {showSetting && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="w-full border-2 border-gray-500 bg-[#fffbe7] rounded-lg shadow-inner p-4 space-y-3 text-sm"
            >
              <h1 className="text-lg font-bold">⏰ Timer Settings</h1>
              <div className="flex justify-between items-center">
                <label htmlFor="focus">Focus (minutes)</label>
                <input
                  type="number"
                  id="focus"
                  min={1}
                  max={60}
                  value={timeFocus}
                  onChange={(e) => setTimeFocus(Number(e.target.value))}
                  className="w-16 border-2 rounded-md p-1 border-gray-400 text-center"
                />
              </div>
              <div className="flex justify-between items-center">
                <label htmlFor="break">Break (minutes)</label>
                <input
                  type="number"
                  id="break"
                  min={1}
                  max={60}
                  value={timeBreak}
                  onChange={(e) => setTimeBreak(Number(e.target.value))}
                  className="w-16 border-2 rounded-md p-1 border-gray-400 text-center"
                />
              </div>
              <button
                onClick={applySetting}
                className="w-full flex items-center justify-center gap-1 bg-green-300 hover:bg-green-400 border-2 border-gray-500 rounded-md p-1 cursor-pointer"
              >
                <Check size={16} />
                Apply
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2 text-sm">
          <p>Sound:</p>
          <select
            defaultValue="none"
            onChange={(e) => setSound(e.target.value)}
            className="border rounded-md px-2 py-1 text-center"
          >
            <option value="none">None</option>
            <option value="bell">Bell</option>
          </select>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default App;
