import { Link } from "react-router-dom";
import { WrapperWithLinkFallbackProps } from "../../interfaces";
import { getVariantClasses } from "../../utils";

const FieldWrapperWithLinkFallback = ({
  children,
  resourceId,
  resourceName,
  uiResourceBaseUrl,
}: WrapperWithLinkFallbackProps) => {
  const initialValueExists = resourceId !== undefined && resourceId !== "";

  return initialValueExists ? (
    <>
      {children}
      <Link
        className={`${getVariantClasses("link")}`}
        to={`${uiResourceBaseUrl}/${resourceId}`}
      >
        {`Edit ${resourceName} details`}
      </Link>
    </>
  ) : (
    <Link
      className={`${getVariantClasses("link")}`}
      to={`${uiResourceBaseUrl}/create`}
    >{`Add ${resourceName}`}</Link>
  );
};
export default FieldWrapperWithLinkFallback;
