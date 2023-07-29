import style from "./styles/navbar.module.css";
import Quiz from "./quiz";

export const meta = () => {
  return [{ title: "Elias Grey's remix quiz app!" }];
};

export default function HomePage() {
  return (
    <>
      <nav className={style.body}>
        <div className={style.logo}>Trivia Challenge</div>
      </nav>
      <div>
        <Quiz />
      </div>
    </>
  );
}
