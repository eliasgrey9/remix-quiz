// export const meta = () => {
//   return [{ title: "App Dashboard" }];
// };

import style from "./styles/homepage.module.css";

export default function Quiz() {
  return (
    <div className={style.body}>
      <div className={style.quizContainer}>Welcome to quiz app</div>
    </div>
  );
}
