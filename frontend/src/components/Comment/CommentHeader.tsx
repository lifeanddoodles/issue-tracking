function CommentHeader({
  firstName,
  lastName,
  createdAt,
  isEdited,
}: {
  firstName: string;
  lastName: string;
  createdAt: string | Date;
  isEdited: boolean;
}) {
  return (
    <header className="comment__header flex gap-2 mb-2">
      <span className="comment__header--author font-bold">{`${firstName} ${lastName}`}</span>
      <div className="w-max-content">
        {createdAt && (
          <span className="comment__header--date">
            {typeof createdAt === "string"
              ? new Date(createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
          </span>
        )}
        {isEdited && <span className="comment__header--edited">Edited</span>}
      </div>
    </header>
  );
}

export default CommentHeader;
