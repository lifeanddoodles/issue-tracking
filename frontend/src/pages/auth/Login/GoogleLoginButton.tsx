import { GOOGLE_AUTH_BASE_API_URL } from "../../../routes";
import { getVariantClasses } from "../../../utils";

const GoogleLoginButton = () => {
  return (
    <a
      className={`block mx-auto max-w-fit ${getVariantClasses("primary")}`}
      href={GOOGLE_AUTH_BASE_API_URL}
    >
      Login with Google
    </a>
  );
};

export default GoogleLoginButton;
