import React, { useEffect, useState } from "react";
import "./SplashScreen.css";
import logo from "../../src/componets/images/logo.jpg";

const SplashScreen = ({ onFinish }) => {
    const [phase, setPhase] = useState("enter"); // enter → splash → exit

    useEffect(() => {
        const t1 = setTimeout(() => setPhase("splash"), 800);
        const t2 = setTimeout(() => setPhase("exit"), 1200);
        const t3 = setTimeout(() => onFinish?.(), 1400);
        return () => [t1, t2, t3].forEach(clearTimeout);
    }, [onFinish]);

    return (
        <div className={`splash-root splash-${phase}`}>
            {/* Ripple rings */}
            {[1, 2, 3, 4].map((i) => (
                <span key={i} className={`ripple ripple-${i}`} />
            ))}

            {/* Water drop particles */}
            {Array.from({ length: 18 }).map((_, i) => (
                <span key={i} className={`drop drop-${i + 1}`} />
            ))}

            {/* Core card */}
            <div className="splash-card">
                <div className="logo-wrap">

                    <img src={logo} alt="Logo" id="logo-img" className="logo-img" />
                  
    
                </div>

                <p className="brand-name">Muthu's Petals</p>
                <p className="tagline">Natural care for You</p>

                <div className="progress-bar">
                    <div className="progress-fill" />
                </div>
            </div>

            {/* Ink blobs background */}
            <div className="blob blob-1" />
            <div className="blob blob-2" />
        </div>
    );
};

export default SplashScreen;