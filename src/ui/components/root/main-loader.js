import React from "react";
import Typography from "@material-ui/core/Typography";

const MainLoader = () => {
    return (
        <div style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)"
        }}>
            <Typography variant="h3" component="h1" className="animated-dots">Einloggen<span>.</span><span>.</span><span>.</span></Typography>
        </div>
    );
};

export default MainLoader;