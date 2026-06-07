"use client";

import React, { useRef, useState } from "react";
import { Sparkles, Layers, Network, FormInput, Cloud } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Brand Icon Components
const NextjsIcon = () => (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-5 text-foreground fill-current">
    <mask id="mask-next" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
      <circle cx="90" cy="90" r="90" fill="black" />
    </mask>
    <g mask="url(#mask-next)">
      <circle cx="90" cy="90" r="90" fill="currentColor" fillOpacity="0.05" />
      <path d="M149.508 157.52L69.142 54H54V126H67.925V74.453L138.835 166.425C142.664 163.766 146.237 160.778 149.508 157.52Z" fill="currentColor" />
      <rect x="115" y="54" width="14" height="72" fill="currentColor" />
    </g>
  </svg>
);

const ReactIcon = () => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-5 text-[#61DAFB] fill-none stroke-current">
    <circle cx="0" cy="0" r="2.05" fill="currentColor" stroke="none" />
    <g strokeWidth="1">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const TypeScriptIcon = () => (
  <div className="size-5 bg-[#3178C6] text-white flex items-center justify-center font-bold text-[9px] rounded-sm select-none">TS</div>
);

const TailwindIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5 text-[#38bdf8] fill-current">
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.7 1.2 1.2 2.6 2.7 5.5 2.7 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.7-1.2-1.2-2.6-2.7-5.5-2.7zM6.001 12c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.7 1.2 1.2 2.6 2.7 5.5 2.7 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.7-1.2-1.2-2.6-2.7-5.5-2.7z" />
  </svg>
);

const JavaScriptIcon = () => (
  <div className="size-5 bg-[#F7DF1E] text-black flex items-end justify-end p-0.5 font-bold text-[9px] rounded-sm select-none leading-none">JS</div>
);

const HtmlIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5 text-[#E34F26] fill-current">
    <path d="M1.5 0h21l-1.91 21.563L12 24l-8.59-2.438L1.5 0zm17.063 6h-11.25l.235 2.625h10.782l-.47 5.25L12 15.313l-5.91-.788-.117-1.313H3.348l.254 2.85 8.398 2.378 8.398-2.378 1.055-11.85.11-.225z" />
  </svg>
);

const NodeIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5 text-[#339933] fill-current">
    <path d="M12 2L2 7.8v10.4L12 24l10-5.8V7.8L12 2zm-1 18.2l-6.8-3.9V8.6L11 4.7v15.5zm8.8-3.9l-6.8 3.9V4.7l6.8 3.9v7.7z" />
  </svg>
);

const ExpressIcon = () => (
  <div className="size-5 border border-foreground/30 text-foreground flex items-center justify-center font-bold text-[8px] rounded-sm select-none bg-muted/40">Ex</div>
);

const MongoIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5 text-[#47A248] fill-current">
    <path d="M12 0C8 5.7 6.3 9.4 6.3 12.3c0 4.1 3 6.9 5.7 6.9 2.7 0 5.7-2.8 5.7-6.9C17.7 9.4 16 5.7 12 0zm0 17.6c-1.8 0-3.9-1.9-3.9-4.7 0-2.3 1.3-5.2 3.9-9.1 2.6 3.9 3.9 6.8 3.9 9.1.1 2.8-2 4.7-3.9 4.7z" />
  </svg>
);

const DockerIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5 text-[#2496ED] fill-current">
    <path d="M13.983 8.871h-1.966V6.905h1.966v1.966zm-2.458 0H9.559V6.905h1.966v1.966zm0-2.458H9.559V4.447h1.966v1.966zm-2.458 2.458H7.1v-1.966h1.966v1.966zm0-2.458H7.1V4.447h1.966v1.966zm-2.458 2.458H4.643v-1.966h1.965v1.966zm2.458-4.915H9.559V1.99h1.966v1.965zm-2.458 2.457H7.1V1.99h1.966v1.965zm-2.458 2.458H4.643V4.447h1.965v1.966zm-2.458 2.458H2.185v-1.966h1.965v1.966zM22.5 13.5c0-1.8-1.5-2.2-2.5-2.2h-.5c-.2 0-.4-.1-.5-.2C18 9 15.5 8 12.8 8v3.5h-1.9V8c-2.7 0-5.2 1-6.2 3.1-.1.1-.3.2-.5.2h-.5c-1 0-2.5.4-2.5 2.2 0 1.8 1.5 2.5 2.5 2.5h15.6c1-.1 2.5-.8 2.5-2.5z" />
  </svg>
);

const CssIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5 text-[#1572B6] fill-current">
    <path d="M1.5 0h21l-1.91 21.563L12 24l-8.59-2.438L1.5 0zm17.03 17.14l-.83-9.39H6.3l.27 3.06h8.22l-.28 3.14L12 17.58l-2.51-.68-.16-1.8h-3.1l.32 3.6 5.46 1.52 5.46-1.52.39-4.48z" />
  </svg>
);

const ReactRouterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-[#F44250]">
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="6" r="3" />
    <path d="M9 15v-3a4 4 0 0 1 4-4h2" />
  </svg>
);

const ReactQueryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-[#FF4154]">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);

const ReduxIcon = () => (
  <div className="size-5 bg-[#764ABC] text-white flex items-center justify-center font-bold text-[8px] rounded-sm select-none">Rx</div>
);

const ShadcnIcon = () => (
  <div className="size-5 bg-foreground text-background flex items-center justify-center font-bold text-[9px] rounded-sm select-none dark:bg-white dark:text-black font-mono">/</div>
);

const MongooseIcon = () => (
  <div className="size-5 border border-red-500/35 text-red-500 flex items-center justify-center font-bold text-[8px] rounded-sm bg-red-500/10">Mg</div>
);

const JwtIcon = () => (
  <div className="size-5 bg-gradient-to-tr from-[#fb0054] via-[#00b9f1] to-[#f3e300] text-black flex items-center justify-center font-bold text-[8px] rounded-sm select-none">JWT</div>
);

const RedisIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5 text-[#D82C20] fill-current">
    <path d="M12 2L2 6.5 12 11l10-4.5L12 2zm0 18.5L3.5 16l8.5-3.8 8.5 3.8-8.5 4.5zm0-4.7l-8.5-3.8 8.5-4.5 8.5 4.5-8.5 3.8z" />
  </svg>
);

const FirebaseIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5 text-[#FFCA28] fill-current">
    <path d="M19.3 16.9L12.9 6.2c-.3-.5-1.1-.5-1.4 0l-2.2 3.7-2.4-7.6c-.1-.4-.6-.5-.9-.1L2.1 14.8c-.3.4-.2 1 .3 1.2l9.1 5c.3.2.7.2 1 0l9.1-5c.5-.2.6-.8.3-1.2z" />
  </svg>
);

const LinuxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-[#FCC624]">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const PostmanIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-[#FF6C37]">
    <path d="M4.5 16.5c-1.5 1.5-2.5 3.5-2.5 5.5h6c0-2-1-4-2.5-5.5z" />
    <path d="M12 2L9 9l3 3 3-3-3-7z" />
    <path d="M13 13l4.5 4.5c1.5 1.5 3.5 2.5 5.5 2.5v-6c-2 0-4-1-5.5-2.5L13 13z" />
  </svg>
);

const VsCodeIcon = () => (
  <div className="size-5 bg-[#007ACC] text-white flex items-center justify-center font-bold text-[8px] rounded-sm select-none">VS</div>
);

const CursorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-[#5e5ce6]">
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    <path d="M13 13l6 6" />
  </svg>
);

const AntigravityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-primary">
    <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(45 12 12)" />
    <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(-45 12 12)" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const VercelIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5 text-foreground fill-current dark:text-white">
    <path d="M24 22.525H0L12 1.475L24 22.525Z" />
  </svg>
);

const NetlifyIcon = () => (
  <div className="size-5 bg-[#00AD9F] text-white flex items-center justify-center font-bold text-[8px] rounded-sm select-none">Nl</div>
);

const FigmaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-[#F24E1E]">
    <path d="M12 22a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
    <path d="M12 7a5 5 0 1 0 0 10V7z" />
  </svg>
);

const PostgresIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5 text-[#336791] fill-current">
    <path d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772a.0569.0569 0 0 0 .0004.0041 11.0312 11.0312 0 0 0-.2472.3054c-.3389.4302-.4094.5197-1.5002.7443-.3102.064-1.1344.2339-1.1464.8115-.0025.1224.0329.2309.0919.3268.2269.4231.9216.6097 1.015.6331 1.3345.3335 2.5044.092 3.3714-.6787-.017 2.231.0775 4.4174.3454 5.0874.2212.5529.7618 1.9045 2.4692 1.9043.2505 0 .5263-.0291.8296-.0941 1.7819-.3821 2.5557-1.1696 2.855-2.9059.1503-.8707.4016-2.8753.5388-4.1012.0169-.0703.0357-.1207.057-.1362.0007-.0005.0697-.0471.4272.0307a.3673.3673 0 0 0 .0443.0068l.2539.0223.0149.001c.8468.0384 1.9114-.1426 2.5312-.4308.6438-.2988 1.8057-1.0323 1.5951-1.6698zM2.371 11.8765c-.7435-2.4358-1.1779-4.8851-1.2123-5.5719-.1086-2.1714.4171-3.6829 1.5623-4.4927 1.8367-1.2986 4.8398-.5408 6.108-.13-.0032.0032-.0066.0061-.0098.0094-2.0238 2.044-1.9758 5.536-1.9708 5.7495-.0002.0823.0066.1989.0162.3593.0348.5873.0996 1.6804-.0735 2.9184-.1609 1.1504.1937 2.2764.9728 3.0892.0806.0841.1648.1631.2518.2374-.3468.3714-1.1004 1.1926-1.9025 2.1576-.5677.6825-.9597.5517-1.0886.5087-.3919-.1307-.813-.5871-1.2381-1.3223-.4796-.839-.9635-2.0317-1.4155-3.5126zm6.0072 5.0871c-.1711-.0428-.3271-.1132-.4322-.1772.0889-.0394.2374-.0902.4833-.1409 1.2833-.2641 1.4815-.4506 1.9143-1.0002.0992-.126.2116-.2687.3673-.4426a.3549.3549 0 0 0 .0737-.1298c.1708-.1513.2724-.1099.4369-.0417.156.0646.3078.26.3695.4752.0291.1016.0619.2945-.0452.4444-.9043 1.2658-2.2216 1.2494-3.1676 1.0128zm2.094-3.988-.0525.141c-.133.3566-.2567.6881-.3334 1.003-.6674-.0021-1.3168-.2872-1.8105-.8024-.6279-.6551-.9131-1.5664-.7825-2.5004.1828-1.3079.1153-2.4468.079-3.0586-.005-.0857-.0095-.1607-.0122-.2199.2957-.2621 1.6659-.9962 2.6429-.7724.4459.1022.7176.4057.8305.928.5846 2.7038.0774 3.8307-.3302 4.7363-.084.1866-.1633.3629-.2311.5454zm7.3637 4.5725c-.0169.1768-.0358.376-.0618.5959l-.146.4383a.3547.3547 0 0 0-.0182.1077c-.0059.4747-.054.6489-.115.8693-.0634.2292-.1353.4891-.1794 1.0575-.11 1.4143-.8782 2.2267-2.4172 2.5565-1.5155.3251-1.7843-.4968-2.0212-1.2217a6.5824 6.5824 0 0 0-.0769-.2266c-.2154-.5858-.1911-1.4119-.1574-2.5551.0165-.5612-.0249-1.9013-.3302-2.6462.0044-.2932.0106-.5909.019-.8918a.3529.3529 0 0 0-.0153-.1126 1.4927 1.4927 0 0 0-.0439-.208c-.1226-.4283-.4213-.7866-.7797-.9351-.1424-.059-.4038-.1672-.7178-.0869.067-.276.1831-.5875.309-.9249l.0529-.142c.0595-.16.134-.3257.213-.5012.4265-.9476 1.0106-2.2453.3766-5.1772-.2374-1.0981-1.0304-1.6343-2.2324-1.5098-.7207.0746-1.3799.3654-1.7088.5321a5.6716 5.6716 0 0 0-.1958.1041c.0918-1.1064.4386-3.1741 1.7357-4.4823a4.0306 4.0306 0 0 1 .3033-.276.3532.3532 0 0 0 .1447-.0644c.7524-.5706 1.6945-.8506 2.802-.8325.4091.0067.8017.0339 1.1742.081 1.939.3544 3.2439 1.4468 4.0359 2.3827.8143.9623 1.2552 1.9315 1.4312 2.4543-1.3232-.1346-2.2234.1268-2.6797.779-.9926 1.4189.543 4.1729 1.2811 5.4964.1353.2426.2522.4522.2889.5413.2403.5825.5515.9713.7787 1.2552.0696.087.1372.1714.1885.245-.4008.1155-1.1208.3825-1.0552 1.717-.0123.1563-.0423.4469-.0834.8148-.0461.2077-.0702.4603-.0994.7662zm.8905-1.6211c-.0405-.8316.2691-.9185.5967-1.0105a2.8566 2.8566 0 0 0 .135-.0406 1.202 1.202 0 0 0 .1342.103c.5703.3765 1.5823.4213 3.0068.1344-.2016.1769-.5189.3994-.9533.6011-.4098.1903-1.0957.333-1.7473.3636-.7197.0336-1.0859-.0807-1.1721-.151zm.5695-9.2712c-.0059.3508-.0542.6692-.1054 1.0017-.055.3576-.112.7274-.1264 1.1762-.0142.4368.0404.8909.0932 1.3301.1066.887.216 1.8003-.2075 2.7014a3.5272 3.5272 0 0 1-.1876-.3856c-.0527-.1276-.1669-.3326-.3251-.6162-.6156-1.1041-2.0574-3.6896-1.3193-4.7446.3795-.5427 1.3408-.5661 2.1781-.463zm.2284 7.0137a12.3762 12.3762 0 0 0-.0853-.1074l-.0355-.0444c.7262-1.1995.5842-2.3862.4578-3.4385-.0519-.4318-.1009-.8396-.0885-1.2226.0129-.4061.0666-.7543.1185-1.0911.0639-.415.1288-.8443.1109-1.3505.0134-.0531.0188-.1158.0118-.1902-.0457-.4855-.5999-1.938-1.7294-3.253-.6076-.7073-1.4896-1.4972-2.6889-2.0395.5251-.1066 1.2328-.2035 2.0244-.1859 2.0515.0456 3.6746.8135 4.8242 2.2824a.908.908 0 0 1 .0667.1002c.7231 1.3556-.2762 6.2751-2.9867 10.5405zm-8.8166-6.1162c-.025.1794-.3089.4225-.6211.4225a.5821.5821 0 0 1-.0809-.0056c-.1873-.026-.3765-.144-.5059-.3156-.0458-.0605-.1203-.178-.1055-.2844.0055-.0401.0261-.0985.0925-.1488.1182-.0894.3518-.1226.6096-.0867.3163.0441.6426.1938.6113.4186zm7.9305-.4114c.0111.0792-.049.201-.1531.3102-.0683.0717-.212.1961-.4079.2232a.5456.5456 0 0 1-.075.0052c-.2935 0-.5414-.2344-.5607-.3717-.024-.1765.2641-.3106.5611-.352.297-.0414.6111.0088.6356.1851z" />
  </svg>
);

// Structured data for technologies
const TECH_STACK_DATA = {
  Frontend: [
    { name: "HTML5", icon: <HtmlIcon /> },
    { name: "CSS3", icon: <CssIcon /> },
    { name: "Tailwind CSS", icon: <TailwindIcon /> },
    { name: "JavaScript (ES6+)", icon: <JavaScriptIcon /> },
    { name: "TypeScript", icon: <TypeScriptIcon /> },
    { name: "React.js", icon: <ReactIcon /> },
    { name: "Next.js", icon: <NextjsIcon /> },
    { name: "React Router", icon: <ReactRouterIcon /> },
    { name: "React Query", icon: <ReactQueryIcon /> },
    { name: "Redux Toolkit", icon: <ReduxIcon /> },
    { name: "Context API", icon: <Network className="size-5 text-indigo-500" /> },
    { name: "React Hook Form", icon: <FormInput className="size-5 text-pink-500" /> },
    { name: "Shadcn UI", icon: <ShadcnIcon /> },
  ],
  Backend: [
    { name: "Node.js", icon: <NodeIcon /> },
    { name: "Express.js", icon: <ExpressIcon /> },
    { name: "REST APIs", icon: <Layers className="size-5 text-orange-500" /> },
    { name: "Mongoose", icon: <MongooseIcon /> },
    { name: "Next.js API / Server Actions", icon: <NextjsIcon /> },
    { name: "JWT Authentication", icon: <JwtIcon /> },
    { name: "Redis", icon: <RedisIcon /> },
    { name: "Firebase Authentication", icon: <FirebaseIcon /> },
  ],
  Database: [
    { name: "MongoDB", icon: <MongoIcon /> },
  ],
  "Other Tools": [
    { name: "Linux", icon: <LinuxIcon /> },
    { name: "Docker", icon: <DockerIcon /> },
    { name: "Git & GitHub", icon: <GithubIcon className="size-5 text-foreground" /> },
    { name: "Postman", icon: <PostmanIcon /> },
    { name: "VS Code", icon: <VsCodeIcon /> },
    { name: "Cursor", icon: <CursorIcon /> },
    { name: "Antigravity", icon: <AntigravityIcon /> },
    { name: "Advanced Prompt Engineering", icon: <Sparkles className="size-5 text-violet-500 animate-pulse" /> },
    { name: "Vercel", icon: <VercelIcon /> },
    { name: "Netlify", icon: <NetlifyIcon /> },
    { name: "Firebase", icon: <FirebaseIcon /> },
    { name: "Figma", icon: <FigmaIcon /> },
    { name: "Cloudinary", icon: <Cloud className="size-5 text-[#3448C5]" /> },
  ],
  "Currently Learning": [
    { name: "PostgreSQL", icon: <PostgresIcon /> },
  ],
};

type TabKeys = keyof typeof TECH_STACK_DATA;

export function TechStack() {
  const [activeTab, setActiveTab] = useState<TabKeys>("Frontend");
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP animation triggers on activeTab change
  useGSAP(
    () => {
      gsap.fromTo(
        ".tech-card",
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    },
    { dependencies: [activeTab], scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="tech-stack"
      className="py-16 sm:py-24 w-full max-w-6xl mx-auto px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Dynamic Grid Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/2 rounded-full blur-3xl -z-10" />

      {/* Premium Section Title */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
          Skills & Architecture
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
          A modular breakdown of my technical capabilities, languages, frameworks, and deployment tooling.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Left Column (Vertical Tabs list) */}
        <div className="md:col-span-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-none border-b md:border-b-0 md:border-r border-border/40 pr-0 md:pr-6">
          {(Object.keys(TECH_STACK_DATA) as TabKeys[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center justify-between px-4 py-3 text-left font-semibold text-sm rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-primary/10 text-primary border-t-4 md:border-t-0 md:border-l-4 border-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border-t-4 md:border-t-0 md:border-l-4 border-transparent"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border transition-colors ${
                    isActive
                      ? "bg-primary/20 border-primary/30 text-primary"
                      : "bg-muted/40 border-border/30 text-muted-foreground"
                  }`}
                >
                  {TECH_STACK_DATA[tab].length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Column (Grid Showcase) */}
        <div className="md:col-span-8 min-h-[280px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {TECH_STACK_DATA[activeTab].map((tech) => (
              <div
                key={tech.name}
                className="tech-card group flex flex-col items-center justify-center p-3.5 bg-card/60 backdrop-blur-md border border-border/40 rounded-xl shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-300"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/40 mb-2.5 text-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10">
                  {tech.icon}
                </div>
                <h4 className="text-xs font-semibold text-center text-foreground group-hover:text-primary transition-colors">
                  {tech.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
