import Heading from "../../components/Heading";
import InternalLink from "../../components/InternalLink";
import Text from "../../components/Text";

const Home = () => {
  return (
    <>
      <Heading level={1} text="Hi, I'm Sandra Vargas" />
      <Text>
        Bug tracking web application created with the{" "}
        <abbr title="MongoDB, Express, React, Node">MERN</abbr> stack.
      </Text>
      <Text>
        Includes user-level and role-level security and access control for
        creating, updating, and assigning tickets.
      </Text>
      <Text>
        Composed a responsive front-end design using HTML5, and Tailwind CSS.
      </Text>
      <InternalLink to="/login" variant="primary">
        Try it now!
      </InternalLink>
    </>
  );
};

export default Home;
