import { twMerge } from "tailwind-merge";
import { getInitials } from "../../../src/utils";

const Avatar = ({
  firstName,
  lastName,
  imageUrl,
  className,
}: {
  firstName: string;
  lastName: string;
  imageUrl?: string;
  className?: string;
}) => {
  const mergedClasses = twMerge(
    `w-10 h-10 avatar rounded-full bg-neutral-300 flex shrink-0 items-center justify-center`,
    className
  );
  return (
    <div className={mergedClasses}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`Profile image of ${firstName} ${lastName}`}
          className="avatar--image"
        />
      ) : (
        <span className="avatar--initials block padding-4">
          {getInitials(firstName, lastName)}
        </span>
      )}
    </div>
  );
};

export default Avatar;
