import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import step1 from '../assets/step1.png';
import step2 from '../assets/step2.png';
import step3 from '../assets/step3.png';
import step4 from '../assets/step4.png';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const IntroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="text-white bg-[#121212]">
      {/* Section 1 */}
      <motion.section
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h1 className="text-5xl font-bold leading-tight mb-6">
          당신의 감정이<br />노래가 되는 순간
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          AI와 함께 만드는 단 하나뿐인 노래,<br />
          누구보다 당신다운 노래를 담아보세요.
        </p>
      </motion.section>

      {/* Section 2 */}
      <motion.section
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <img src={step1} alt="아이디어 없이 시작" className="w-[70rem] h-auto mb-4 rounded-xl shadow-lg" />
        <p className="text-2xl font-semibold">
          아이디어가 없더라도 걱정 마세요!<br />
          인공지능이 당신을 도와줄 거예요.
        </p>
      </motion.section>

      {/* Section 3 */}
      <motion.section
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <img src={step2} alt="노래 선택" className="w-[70rem] h-auto mb-4 rounded-xl shadow-lg" />
        <p className="text-2xl font-semibold">
          노래를 미리 들어보고<br />
          원하는 노래를 선택할 수 있어요.
        </p>
      </motion.section>

      {/* Section 4 */}
      <motion.section
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <img src={step3} alt="노래 공유" className="w-[35rem] h-auto mb-4 rounded-xl shadow-lg" />
        <p className="text-2xl font-semibold">
          노래를 게시판에 올려<br />
          다른 사람들과 공유할 수 있어요.
        </p>
      </motion.section>

      {/* Section 5 (여기만 mb-12 삭제) */}
      <motion.section
        className="min-h-screen flex flex-col justify-center items-center text-center px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <img src={step4} alt="유튜브 업로드" className="w-[60rem] h-auto mb-4 rounded-xl shadow-lg" />
        <p className="text-2xl font-semibold">
          AI와 함께 만든 노래를<br />
          유튜브에 업로드 해보세요!
        </p>
      </motion.section>
    </div>
  );
};

export default IntroSection;