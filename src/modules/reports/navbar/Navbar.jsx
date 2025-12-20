import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import styles from "./Navbar.module.css";
import content from "../../../utils/content";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <h1>{content.appTitle}</h1>
      <Link to="/login" className={styles.loginBtn}>
        <Lock size={16} /> {content.common.adminLogin}
      </Link>
    </nav>
  );
}
