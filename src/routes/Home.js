import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "../components/Loading";
import axios from "axios";
import MainSliderCard from "../components/MainSliderCard";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainSliderTextBox from "../components/MainSliderTextBox";

const rowVariants = {
  hidden: (back) => ({
    x: back ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (back) => ({
    x: back ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
};

function Home() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);

  const getMovies = async () => {
    await axios
      .get("https://yts.mx/api/v2/list_movies.json?&limit=5&sort_by=rating")
      .then((res) => {
        setMovies(res.data.data.movies);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    getMovies();
    return;
  }, []);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = () => {
    if (movies) {
      if (leaving) return;
      toggleLeaving();
      const total = 4;
      setBack(false);
      setIndex((prev) => (prev === total ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (movies) {
      if (leaving) return;
      toggleLeaving();
      const total = 0;
      setBack(true);
      setIndex((prev) => (prev === total ? 4 : prev - 1));
    }
  };
  return (
    <div className={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.slider}>
          <AnimatePresence initial={false} custom={back} onExitComplete={toggleLeaving}>
            <motion.div
              className={styles.row}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 0.5 }}
              custom={back}
              key={index}
            >
              {movies?.slice(index, index + 1).map((movie) => (
                <MainSliderCard
                  key={movie.id}
                  id={movie.id}
                  large_cover_image={movie.large_cover_image}
                ></MainSliderCard>
              ))}
            </motion.div>
            <div className={styles.textBox}>
              {movies?.slice(index, index + 1).map((movie) => (
                <MainSliderTextBox
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  summary={movie.summary}
                ></MainSliderTextBox>
              ))}
            </div>
          </AnimatePresence>
          <div className={styles.next} onClick={increaseIndex}>
            <FontAwesomeIcon icon={faAngleRight} size="lg" />
          </div>
          <div className={styles.prev} onClick={decreaseIndex}>
            <FontAwesomeIcon icon={faAngleLeft} size="lg" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
