import { Activity } from "lucide-react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <Activity />
        </div>
        <div>
          <div className="header-title">SonicPulse AI</div>
          <div className="header-subtitle">
            Acoustic Valve Anomaly Detection using Deep Learning
          </div>
        </div>
      </div>
      <div className="header-status">
        <span className="header-status-dot" />
        System Online
      </div>
    </header>
  );
}

export default Header;
