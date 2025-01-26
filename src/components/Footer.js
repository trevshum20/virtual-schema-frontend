import React from "react";

const Footer = () => {
    return (
        <footer className="bg-light text-center text-small py-3">
            <div className="container-fluid">
                <p className="mb-1">
                    Trevor Shumway &copy; 2025 | <a href="tel:801-472-6602">801-472-6602</a> | <a href="mailto:trevshum20@gmail.com">trevshum20@gmail.com</a>
                </p>
                <div>
                    <a
                        href="https://github.com/trevshum20"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark"
                        aria-label="GitHub"
                        style={{ marginRight: "20px", fontSize: "30px" }}
                    >
                        <i className="bi bi-github"></i>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/trevor-shumway1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark"
                        aria-label="LinkedIn"
                        style={{ marginRight: "20px", fontSize: "30px" }}
                    >
                        <i className="bi bi-linkedin"></i>
                    </a>
                    <a
                        href="https://www.salesforce.com/trailblazer/tshumway4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark"
                        aria-label="Trailhead"
                        style={{ fontSize: "30px" }}
                    >
                        <i className="bi bi-cloud"></i>
                    </a>
                </div>
            </div>
        </footer>

    );
};

export default Footer;
