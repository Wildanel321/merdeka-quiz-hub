import { motion } from "framer-motion";

const Banner = () => {
  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-r from-primary via-primary to-secondary py-6 px-4 shadow-lg"
    >
      <div className="container mx-auto">
        <motion.h1 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 3
          }}
          className="text-3xl md:text-5xl font-bold text-center text-primary-foreground drop-shadow-lg"
        >
          🇮🇩 Semangat Merdeka! 🇮🇩
        </motion.h1>
        <p className="text-center text-primary-foreground/90 mt-2 text-sm md:text-base">
          Quiz Pelajaran Interaktif Kurikulum Merdeka Kelas 12
        </p>
      </div>
    </motion.div>
  );
};

export default Banner;
