import { Link } from "react-router-dom";
import { WrapperWithLinkFallbackProps } from "../../interfaces";

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
      <Link to={`${uiResourceBaseUrl}/${resourceId}`}>
        {`Edit ${resourceName} details`}
      </Link>
    </>
  ) : (
    <Link to={`${uiResourceBaseUrl}/create`}>{`Add ${resourceName}`}</Link>
  );
};
export default FieldWrapperWithLinkFallback;
