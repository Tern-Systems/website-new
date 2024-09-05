
import Image from "next/image";
import styles from './page.module.css';


export default function Home() {
  return (
<div className="min-h-screen flex flex-col">
      <div className="flex-grow flex relative">
        <aside className="m-[54px] flex-shrink-0 flex items-center z-10">
          <div className="text-[36px] flex flex-col gap-[40px]">
            <div className={styles.icon}>
              <span className={styles.iconSymbol}>-</span>
              <span className={styles.iconText}>About</span>
            </div>
            <div className={styles.icon}>
              <span className={styles.iconSymbol}>0</span>
              <span className={styles.iconText1}>TernKey</span>
            </div>
            <div className={styles.icon}>
              <span className={styles.iconSymbol}>+</span>
              <span className={styles.iconText2}>Contact</span>
            </div>
          </div>
        </aside>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src="/images/Tern_Systems_Logo_Insignia.png"
            alt="Tern Systems Logo"
            width={100}
            height={100}
          />
        </div>
      </div>

      <footer className={`${styles.footer} text-[14px] text-white w-full flex justify-between px-[54px] pb-[50px]`}>
          <div className="max-w-[500px]">
             <p>Develop, manufacture, preserve, and enhance fundamental computer
                software and hardware, emphasizing universal efficiency across all
                processes.
              </p>
          </div>
          <div className="self-end">
             <p>
                New York, New York
              </p>
          </div>        
      </footer>
    </div>

  );
}
