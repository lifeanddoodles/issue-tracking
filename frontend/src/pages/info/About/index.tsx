import ExternalLink from "../../../components/ExternalLink";
import Heading from "../../../components/Heading";
import Text from "../../../components/Text";
import { getVariantClasses } from "../../../utils";

const About = () => {
  return (
    <>
      <Heading level={1} text="Hi, I'm Sandra Vargas" />
      <Text>
        I'm a Front-end developer with 12+ years of professional experience
        creating websites and 3 working with web applications.
      </Text>
      <Text>
        I like solving problems, creating new features and overall improving
        whatever project I work on. To see some of my other projects and learn
        more about me, visit my portfolio.
      </Text>
      <ExternalLink
        href="https://sandravargas.dev/"
        className={`${getVariantClasses("primary")} w-fit`}
      >
        View my portfolio
      </ExternalLink>
    </>
  );
};

export default About;
