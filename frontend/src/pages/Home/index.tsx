import InternalLink from "../../components/InternalLink";

const Home = () => {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Welcome</h1>
      <p>
        Bug tracking web application created with the{" "}
        <abbr title="MongoDB, Express, React, Node">MERN</abbr> stack.
      </p>
      <p>
        Includes user-level and role-level security and access control for
        creating, updating, and assigning tickets.
      </p>
      <p>
        Composed a responsive front-end design using HTML5, and Tailwind CSS.
      </p>
      <InternalLink to="/login" variant="primary">
        Try it now!
      </InternalLink>
    </>
  );
};

export default Home;
