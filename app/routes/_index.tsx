import style from "./styles/navbar.module.css";
import Quiz from "./quiz";

// export const meta = () => {
//   return [{ title: "Welcome to RenderATL!" }];
// };

export default function HomePage() {
  return (
    <>
      <nav className={style.body}>
        <div className={style.logo}>Remix Quiz App</div>
      </nav>
      <div>
        <Quiz />
      </div>
    </>
  );
}
