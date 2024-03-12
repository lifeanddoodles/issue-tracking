import { Link } from "react-router-dom";
import { WrapperWithLinkFallbackProps } from "../../interfaces";
import { getVariantClasses } from "../../utils";

const FieldWrapperWithLinkFallback = ({
  children,
  resourceId,
  resourceName,
  uiResourceBaseUrl,
  secondaryLabels,
  forceVisible,
}: WrapperWithLinkFallbackProps) => {
  const initialValueExists = resourceId !== undefined && resourceId !== "";

  return forceVisible || initialValueExists ? (
    <>
      {children}
      {resourceId && (
        <Link
          className={`${getVariantClasses("link")}`}
          to={`${uiResourceBaseUrl}/${resourceId}`}
        >
          {secondaryLabels?.edit || `Edit ${resourceName} details`}
        </Link>
      )}
    </>
  ) : (
    <Link
      className={`${getVariantClasses("link")}`}
      to={`${uiResourceBaseUrl}/create`}
    >
      {secondaryLabels?.create || `Add ${resourceName}`}
    </Link>
  );
};
export default FieldWrapperWithLinkFallback;
