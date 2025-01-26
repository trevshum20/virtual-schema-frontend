import React from "react";

const About = () => {
    return (
        <div className="container-fluid p-6">
            <div className="row">
                {/* Main Content Column */}
                <div className="col-md-9">
                    <h1 className="text-3xl font-bold text-center">About Virtual Schema Manager</h1>
                    <br />
                    <p>
                        Virtual Schema Manager is a full-stack web application built with Java Spring Boot (Maven) on the backend and React on the frontend. It dynamically creates a virtual database
                        schema at runtime using metadata stored in a relational database, allowing users to flexibly create, edit, and delete both schema definitions and records without downtime.
                        This approach solves a real pain point around working with relational databases, combines relational and dynamic paradigms, and is technically interesting! It showcases my ability to solve complex
                        problems with innovative solutions.
                    </p>
                    <br></br>
                    <br></br>
                    <div class="accordion" id="accordionPanelsStayOpenExample">
                        <div class="accordion-item">
                            <h4 class="accordion-header" id="panelsStayOpen-headingWhy">
                                <button
                                    class="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseWhy"
                                    aria-expanded="false"
                                    aria-controls="panelsStayOpen-collapseWhy"
                                >
                                    Why did I build Virtual Schema Manager?
                                </button>
                            </h4>
                            <div
                                id="panelsStayOpen-collapseWhy"
                                class="accordion-collapse collapse"
                                aria-labelledby="panelsStayOpen-headingWhy"
                            >
                                <div class="accordion-body">
                                    <p>
                                        I created this app because I wanted to practice full-stack web
                                        development with a new framework/tech stack, and I enjoy software and
                                        web development!
                                    </p>
                                    <p>
                                        I have three years of experience writing software on the Salesforce
                                        platform using Apex on the backend (Salesforce's Java-like language)
                                        and the LWC framework, which is a modern web dev framework similar to
                                        React and Angular.
                                    </p>
                                    <p>
                                        Since Apex and LWC are very niche and virtually unheard of outside the
                                        Salesforce world, I wanted to prove that I can apply my development
                                        skills to the more common frameworks and tech stacks! Hence the Java
                                        backend and the React front end.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <div class="accordion-item">
                            <h4 class="accordion-header" id="panelsStayOpen-headingWhat">
                                <button
                                    class="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseWhat"
                                    aria-expanded="false"
                                    aria-controls="panelsStayOpen-collapseWhat"
                                >
                                    What is Virtual Schema Manager Technically?
                                </button>
                            </h4>
                            <div
                                id="panelsStayOpen-collapseWhat"
                                class="accordion-collapse collapse"
                                aria-labelledby="panelsStayOpen-headingWhat"
                            >
                                <div class="accordion-body">
                                    <p>
                                        Virtual Schema Manager is a tool that constructs a virtual schema at
                                        runtime using metadata that is stored in an RDS, and then populates a
                                        "View" with the associated records.
                                    </p>
                                    <p>
                                        This enables users to dynamically make live/real-time updates to their
                                        schema without running into the common issues of live edits in a
                                        relational database.
                                    </p>
                                    <p>
                                        The best part of Virtual Schema Manager is that all the complexity is
                                        abstracted away from the User. To them, it looks like they're working
                                        with a standard schema that has columns and rows, and they can do CRUD
                                        operations on their records.
                                    </p>
                                    <p>Some examples of on-the-fly schema updates you can make very easily with my web app are:</p>
                                    <ul>
                                        <li>add new columns</li>
                                        <li>rename existing columns</li>
                                        <li>update column data types</li>
                                    </ul>
                                    <p>
                                        Note: My code stores schema metadata behind the scenes in an RDS to
                                        accomplish this, and therefore I still have to conform to the norms of
                                        Relational Database Management. But users can be much more flexible
                                        with their virtual schema.
                                    </p>
                                    <p>
                                        Lastly, Virtual Schema Management is still just a small
                                        proof-of-concept/MVP and not a finished product that would be
                                        production ready. I would not yet try to sell this tool to customers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                <br></br>
                <br></br>
                <br></br>
                </div>

                {/* YouTube Video Column */}
                <div className="col-md-3">
                    <h1 className="text-3xl font-bold text-center">&nbsp;</h1>
                    <br></br>
                    <p>This video demos how Virtual Schema Manager works behind the scenes, discussing the database setup, Java app, and React workflow.</p>
                    <div className="ratio ratio-16x9">
                        <iframe
                            src="https://www.youtube.com/embed/TrsB04iWuTQ"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
