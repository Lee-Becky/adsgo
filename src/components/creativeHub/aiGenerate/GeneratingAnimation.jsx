import { useState, useEffect } from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

// ── SVG path data ported from source ──────────────────────────────────────────
const svgPaths = {
  p1179b80:  'M35.7492 0.607623C50.1517 0.607623 58.9708 3.44941 64.1838 8.18282C69.4154 12.9332 70.8908 19.4732 70.8908 26.5402C70.8908 33.6218 69.231 40.156 63.9143 44.9006C58.616 49.6285 49.8024 52.4729 35.7492 52.4729C26.1923 52.4729 17.4168 51.3692 11.0188 47.5617C4.55697 43.7162 0.607648 37.1678 0.607623 26.5402C0.607623 19.4732 2.08305 12.9332 7.31465 8.18282C12.5277 3.44942 21.3468 0.60763 35.7492 0.607623Z',
  p13bc9480: 'M70.2835 26.5401C70.2835 40.5268 63.7309 51.8652 35.7493 51.8652C16.6765 51.8652 1.21504 47.4378 1.21504 26.5401C1.21504 12.5535 7.0593 1.21504 35.7493 1.21504C64.4393 1.21504 70.2835 12.5535 70.2835 26.5401Z',
  p15f73980: 'M9.27598 5.44804C10.5393 5.44804 10.3316 9.69276 12.3194 11.6869C14.3116 13.6767 18.5519 13.4689 18.5519 14.7335C18.5519 15.9981 14.3116 15.7904 12.3194 17.7801C10.3316 19.7743 10.5393 24.019 9.27598 24.019C8.01261 24.019 8.22011 19.7743 6.23255 17.7801C4.24034 15.7904 2.09808e-05 15.9981 2.09808e-05 14.7335C2.09808e-05 13.4689 4.24034 13.6767 6.23255 11.6869C8.22011 9.69276 8.01261 5.44804 9.27598 5.44804Z',
  p19791270: 'M41.6927 6.12352C42.9922 7.42302 42.9922 9.52992 41.6927 10.8294L38.4997 14.0224L41.6927 17.2154C42.9922 18.5149 42.9922 20.6218 41.6927 21.9213C40.3932 23.2208 38.2863 23.2208 36.9868 21.9213L31.4409 16.3754C30.1414 15.0759 30.1414 12.969 31.4409 11.6695L36.9868 6.12352C38.2863 4.82403 40.3932 4.82403 41.6927 6.12352Z',
  p3acb3600: 'M18.5532 0C19.2952 0 19.173 2.49032 20.3406 3.66033C21.5106 4.82764 24.0007 4.70568 24.0007 5.44772C24.0007 6.18951 21.5103 6.06755 20.3406 7.23487C19.173 8.40487 19.295 10.8952 18.5532 10.8952C17.8114 10.8952 17.9331 8.40487 16.7658 7.23487C15.5958 6.06755 13.1055 6.18951 13.1055 5.44772C13.1055 4.70568 15.596 4.82764 16.7658 3.66033C17.9331 2.49032 17.8114 0 18.5532 0Z',
  p72ec180:  'M34.5342 0.303711C48.8503 0.303711 57.391 3.13496 62.3555 7.64258C67.3106 12.1418 68.7646 18.3688 68.7646 25.3252C68.7646 32.2743 67.1371 38.5038 62.0918 43.0059C57.0371 47.5162 48.4936 50.3467 34.5342 50.3467C25.0083 50.3467 16.4456 49.2381 10.2705 45.5635C4.12728 41.9076 0.303735 35.6845 0.303711 25.3252C0.303711 18.3688 1.75781 12.1418 6.71289 7.64258C11.6774 3.13493 20.2181 0.303718 34.5342 0.303711Z',
  pbeb0c00:  'M69.0685 25.3251C69.0685 39.3118 62.5158 50.6502 34.5342 50.6502C15.4615 50.6502 0 46.2227 0 25.3251C0 11.3384 5.84425 0 34.5342 0C63.2242 0 69.0685 11.3384 69.0685 25.3251Z',
  pd8c3830:  'M86.4 43.2C86.4 55.8781 80.9386 67.2806 72.2402 75.1834C68.7005 78.3992 68.379 82.3992 68.3918 87.0522C68.3933 87.5831 67.8449 87.9434 67.3594 87.7287C64.7802 86.5881 58.1328 83.8234 55.8 84.5336C51.8137 85.7472 47.5831 86.4 43.2 86.4C19.3413 86.4 0 67.0587 0 43.2C0 19.3413 19.3413 0 43.2 0C67.0587 0 86.4 19.3413 86.4 43.2Z',
};

// ── SparkleFrame ──────────────────────────────────────────────────────────────
function SparkleFrame() {
  return (
    <div className="h-[24.019px] relative w-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.0007 24.019">
        <g>
          <path d={svgPaths.p15f73980} fill="url(#sg_paint0)" />
          <path d={svgPaths.p3acb3600} fill="url(#sg_paint1)" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="sg_paint0" x1="2.09495e-05" x2="18.5519" y1="11.9271" y2="11.9202">
            <stop stopColor="#C3A2FE" />
            <stop offset="0.565" stopColor="#6424EF" />
            <stop offset="1" stopColor="#0D031F" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="sg_paint1" x1="13.1055" x2="24.0007" y1="3.80112" y2="3.79707">
            <stop stopColor="#C3A2FE" />
            <stop offset="0.565" stopColor="#6424EF" />
            <stop offset="1" stopColor="#0D031F" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ── ToolGroup ─────────────────────────────────────────────────────────────────
function ToolGroup() {
  return (
    <div className="absolute inset-[43.28%_27.69%_35.22%_27.93%]">
      <div className="absolute inset-[-23.24%_-11.26%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46.9845 27.2131">
          <g>
            <g filter="url(#tg_filter0)">
              <rect fill="url(#tg_paint0)" height="18.0243" rx="4.15946" width="8.31892" x="4.3172" y="4.3172" />
            </g>
            <g filter="url(#tg_filter1)">
              <path clipRule="evenodd" d={svgPaths.p19791270} fill="url(#tg_paint1)" fillRule="evenodd" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="26.6587" id="tg_filter0" width="16.9533" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset /><feGaussianBlur stdDeviation="2.1586" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.441754 0 0 0 0 0.0996028 0 0 0 0 1 0 0 0 0.5 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="26.3814" id="tg_filter1" width="20.8355" x="26.1491" y="0.831703">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset /><feGaussianBlur stdDeviation="2.1586" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.441754 0 0 0 0 0.0996028 0 0 0 0 1 0 0 0 0.5 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow2" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow2" mode="normal" result="shape" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="tg_paint0" x1="8.6958" x2="14.1415" y1="3.88856" y2="21.6283">
              <stop stopColor="#ACFF47" /><stop offset="0.49" stopColor="#4ECDFF" /><stop offset="1" stopColor="#7033F5" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="tg_paint1" x1="36.8882" x2="40.6666" y1="4.72686" y2="23.0611">
              <stop stopColor="#ACFF47" /><stop offset="0.49" stopColor="#4ECDFF" /><stop offset="1" stopColor="#7033F5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

// ── BotIcon ───────────────────────────────────────────────────────────────────
function BotIcon() {
  return (
    <div className="relative size-full">
      {/* Head sphere */}
      <div className="-translate-x-1/2 absolute left-[calc(50%-2.3px)] size-[86.4px] top-[18px]">
        <div className="absolute inset-[0_0_-2.08%_0]">
          <div className="absolute inset-[0_0_0.46%_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 86.4 87.7918">
              <g filter="url(#bot_fi0)">
                <path d={svgPaths.pd8c3830} fill="url(#bot_p0)" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="92.8005" id="bot_fi0" width="86.4" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset dy="5.0087" /><feGaussianBlur stdDeviation="2.50435" />
                  <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                  <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                  <feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
                </filter>
                <linearGradient gradientUnits="userSpaceOnUse" id="bot_p0" x1="11.8957" x2="68.2521" y1="13.7739" y2="85.4137">
                  <stop stopColor="#DFE5FF" /><stop offset="0.722134" stopColor="#7E5FF8" /><stop offset="1" stopColor="#C280FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        {/* Face ellipse outer */}
        <div className="absolute inset-[22.74%_9.25%_18.64%_10.81%]">
          <div className="absolute inset-[-2.4%_-1.76%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 71.4986 53.0803">
              <g>
                <g filter="url(#bot_fi1)">
                  <path d={svgPaths.p13bc9480} fill="url(#bot_p1)" />
                </g>
                <path d={svgPaths.p1179b80} stroke="url(#bot_p2)" strokeWidth="1.21504" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="53.0803" id="bot_fi1" width="71.4986" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset dx="10.9354" dy="2.43009" />
                  <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                  <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
                  <feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
                </filter>
                <linearGradient gradientUnits="userSpaceOnUse" id="bot_p1" x1="2.97102" x2="70.2835" y1="22.3648" y2="22.3648">
                  <stop stopColor="#332B42" /><stop offset="1" stopColor="#232A35" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="bot_p2" x1="2.97102" x2="70.2835" y1="24.7061" y2="25.2915">
                  <stop stopColor="#B3FF49" stopOpacity="0.5" /><stop offset="0.565" stopColor="#18ECFF" stopOpacity="0.5" /><stop offset="1" stopColor="#C28CFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        {/* Face ellipse inner */}
        <div className="absolute inset-[22.74%_9.25%_18.64%_10.81%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69.0685 50.6502">
            <g>
              <g filter="url(#bot_fi2)">
                <path d={svgPaths.pbeb0c00} fill="url(#bot_p3)" />
              </g>
              <path d={svgPaths.p72ec180} stroke="url(#bot_p4)" strokeWidth="0.607522" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="50.6502" id="bot_fi2" width="69.0685" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="10.9354" dy="2.43009" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
                <feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="bot_p3" x1="1.75598" x2="69.0685" y1="21.1498" y2="21.1498">
                <stop stopColor="#332B42" /><stop offset="1" stopColor="#232A35" />
              </linearGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="bot_p4" x1="32.1929" x2="55.0206" y1="4.53492e-07" y2="49.1674">
                <stop /><stop offset="1" stopOpacity="0.11" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <ToolGroup />
      </div>
      {/* Sparkle top-right */}
      <div className="absolute flex h-[24.019px] items-center justify-center left-[90.2px] top-[4px] w-[24px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <SparkleFrame />
        </div>
      </div>
    </div>
  );
}

// ── Loading texts ─────────────────────────────────────────────────────────────
const LOADING_TEXTS = [
  'Analyzing product features...',
  'Understanding visual context...',
  'Composing creative layout...',
  'Rendering fine details...',
  'Applying final touches...',
];

// ── GeneratingAnimation ───────────────────────────────────────────────────────
export default function GeneratingAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % LOADING_TEXTS.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Central Animation Stage */}
      <div className="relative flex items-center justify-center mb-16 h-40 w-full max-w-md">

        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-40 bg-[#5E26D6] opacity-10 blur-3xl rounded-full pointer-events-none" />

        {/* Left icon block */}
        <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-100/50 flex items-center justify-center z-10 animate-gen-fade-in-left">
          <ImageIcon className="w-8 h-8 text-[#8B6EE1]" strokeWidth={1.5} />
        </div>

        {/* Left dots */}
        <div className="flex space-x-2 px-6">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#8B6EE1] animate-gen-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Center — rings + BotIcon */}
        <div className="relative flex items-center justify-center w-36 h-36 z-20">
          {/* Pulsing rings */}
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute inset-4 rounded-full border-[1.5px] border-[#C3A2FE]/40 bg-[#C3A2FE]/5 animate-gen-ring"
              style={{ animationDelay: `${i}s` }}
            />
          ))}
          {/* BotIcon floats up/down */}
          <div className="relative w-[120px] h-[120px] flex items-center justify-center z-10 animate-gen-float">
            <BotIcon />
          </div>
        </div>

        {/* Right dots */}
        <div className="flex space-x-2 px-6">
          {[3, 4, 5].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#8B6EE1] animate-gen-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Right icon block */}
        <div className="w-20 h-20 bg-gradient-to-bl from-purple-50 to-fuchsia-50 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-100/50 flex items-center justify-center z-10 animate-gen-fade-in-right">
          <Sparkles className="w-8 h-8 text-[#8B6EE1]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Text carousel */}
      <div className="text-center h-24 flex flex-col justify-start items-center">
        <div className="relative h-10 w-full overflow-hidden flex justify-center items-center">
          <p
            key={step}
            className="absolute text-xl font-bold tracking-tight bg-gradient-to-r from-[#C3A2FE] via-[#6224EF] to-[#0D031F] text-transparent bg-clip-text whitespace-nowrap animate-gen-text-in"
          >
            {LOADING_TEXTS[step]}
          </p>
        </div>
        <p className="mt-3 text-sm text-neutral-400 font-medium tracking-wide">
          Creative in production. This usually takes 1-2 minutes.
        </p>
      </div>
    </div>
  );
}
